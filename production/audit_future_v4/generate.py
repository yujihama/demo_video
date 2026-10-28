"""audit_future_v4: MiniMax H3 scene generation, one clip at a time, with provenance.

Usage (from the workspace root, with ComfyUI running on 127.0.0.1:8188):
  python_embeded\\python.exe production\\audit_future_v4\\generate.py --res low  --start 1 --end 12
  python_embeded\\python.exe production\\audit_future_v4\\generate.py --res high --start 1 --end 12

--res low  : 608x352, 12 steps  (rough pass, ~4-6 min per clip)
--res high : 864x480, 20 steps  (final pass, ~12-13 min per clip)
"first": "last:NN" means the last frame of scene NN generated at the same resolution.

Polling tolerates transient connection errors. If a previous run died while a prompt
was submitted (active_{res}.json state=submitted), that prompt is waited for and harvested
instead of being resubmitted.
"""
import argparse
import hashlib
import json
import sys
import time
import shutil
import urllib.error
from pathlib import Path

import av

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(ROOT / "production/accounting_future_v3"))
from generate_scene import request_json as _request_json, find_video, INPUT_ROOT  # noqa: E402

PROJECT = "audit_future_v4"
RES = {
    "low": {"width": 608, "height": 352, "steps": 12},
    "high": {"width": 864, "height": 480, "steps": 20},
}
FRAMES = 192


def request_json(path, payload=None, retries=30):
    """ComfyUI request with retry on transient network failures (server stays busy during sampling)."""
    for attempt in range(retries):
        try:
            return _request_json(path, payload)
        except (urllib.error.URLError, ConnectionError, OSError, TimeoutError) as error:
            if payload is not None and path == "/prompt":
                raise  # never retry a submission blindly; it could enqueue twice
            if attempt == retries - 1:
                raise
            print(json.dumps({"retry": path, "attempt": attempt + 1, "error": str(error)[:80]}), flush=True)
            time.sleep(10)


def make_graph(prompt, seed, prefix, first, width, height, steps):
    cond = {"clip": ["2", 0], "vae": ["3", 0], "prompt": prompt,
            "width": width, "height": height, "length": FRAMES}
    graph = {
        "1": {"class_type": "UNETLoader", "inputs": {"unet_name": "minimax_h3_fl2va_pruned_int8_convrot.safetensors", "weight_dtype": "default"}},
        "2": {"class_type": "CLIPLoader", "inputs": {"clip_name": "qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors", "type": "minimax", "device": "default"}},
        "3": {"class_type": "VAELoader", "inputs": {"vae_name": "minimax_h3_video_vae_fp16.safetensors"}},
        "4": {"class_type": "VAELoader", "inputs": {"vae_name": "minimax_h3_audio_vae_fp32.safetensors"}},
        "5": {"class_type": "MiniMaxH3ImageToVideo", "inputs": cond},
        "6": {"class_type": "RandomNoise", "inputs": {"noise_seed": seed}},
        "7": {"class_type": "BasicScheduler", "inputs": {"model": ["1", 0], "scheduler": "simple", "steps": steps, "denoise": 1.0}},
        "8": {"class_type": "KSamplerSelect", "inputs": {"sampler_name": "res_multistep"}},
        "9": {"class_type": "BasicGuider", "inputs": {"model": ["1", 0], "conditioning": ["5", 0]}},
        "10": {"class_type": "SamplerCustomAdvanced", "inputs": {"noise": ["6", 0], "guider": ["9", 0], "sampler": ["8", 0], "sigmas": ["7", 0], "latent_image": ["5", 1]}},
        "11": {"class_type": "VAEDecode", "inputs": {"samples": ["10", 0], "vae": ["3", 0]}},
        "12": {"class_type": "VAEDecodeAudio", "inputs": {"samples": ["10", 0], "vae": ["4", 0]}},
        "13": {"class_type": "CreateVideo", "inputs": {"images": ["11", 0], "audio": ["12", 0], "fps": 24.0, "bit_depth": 8}},
        "14": {"class_type": "SaveVideo", "inputs": {"video": ["13", 0], "filename_prefix": prefix, "format": "auto", "codec": "auto"}},
    }
    if first:
        graph["15"] = {"class_type": "LoadImage", "inputs": {"image": first}}
        cond["first_frame"] = ["15", 0]
    return graph


def resolve_first(spec, res):
    if spec.startswith("last:"):
        return f"{PROJECT}/scene{int(spec[5:]):02}_last_{res}.png"
    return f"{PROJECT}/{spec}"


def wait_for(prompt_id, scene_id, started):
    last_report = 0
    while True:
        history = request_json(f"/history/{prompt_id}")
        if prompt_id in history:
            return history[prompt_id]
        elapsed = time.monotonic() - started
        if elapsed - last_report >= 60:
            print(json.dumps({"scene": scene_id, "elapsed": round(elapsed)}), flush=True)
            last_report = elapsed
        if elapsed > 3600:
            raise TimeoutError("Prompt may still be running; do not resubmit.")
        time.sleep(5)


def harvest(item, scene, res, cfg, destination, seed, first, prompt_id, started, records, manifest):
    number = int(scene["id"])
    if item.get("status", {}).get("status_str") == "error":
        (HERE / f"error_{res}_{number:02}.json").write_text(json.dumps(item, indent=2), encoding="utf-8")
        raise RuntimeError(f"Scene {number} failed; error saved.")
    source = find_video(item)
    shutil.copy2(source, destination)
    qc = HERE / "qc" / res / f"scene{number:02}"
    qc.mkdir(parents=True, exist_ok=True)
    with av.open(str(destination)) as container:
        stream = container.streams.video[0]
        dims = [stream.width, stream.height, float(stream.average_rate)]
        count = 0
        for count, frame in enumerate(container.decode(video=0), 1):
            if (count - 1) % 48 == 0 or count == FRAMES:
                frame.to_image().save(qc / f"frame{count-1:03}.png")
            if count == FRAMES:
                frame.to_image().save(INPUT_ROOT / PROJECT / f"scene{number:02}_last_{res}.png")
    if dims != [cfg["width"], cfg["height"], 24] or count != FRAMES:
        raise RuntimeError(f"Unexpected clip dimensions or length: {dims} x {count}")
    records[scene["id"]] = {
        **scene, "resolved_first": first, "prompt_id": prompt_id, "seed": seed,
        "elapsed_seconds": round(time.monotonic() - started, 1),
        "width": cfg["width"], "height": cfg["height"], "fps": 24, "frames": count, "steps": cfg["steps"],
        "sha256": hashlib.sha256(destination.read_bytes()).hexdigest(),
    }
    manifest.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"complete": scene["id"], "seconds": records[scene["id"]]["elapsed_seconds"]}), flush=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--res", choices=RES, default="low")
    parser.add_argument("--start", type=int, default=1)
    parser.add_argument("--end", type=int, default=8)
    parser.add_argument("--steps", type=int)
    parser.add_argument("--seed-offset", type=int, default=0, help="change to retry a scene with a new seed")
    args = parser.parse_args()
    cfg = dict(RES[args.res])
    if args.steps:
        cfg["steps"] = args.steps
    plan = {int(s["id"]): s for s in json.loads((HERE / "scene_plan.json").read_text(encoding="utf-8"))}
    manifest = HERE / f"generation_manifest_{args.res}.json"
    records = json.loads(manifest.read_text(encoding="utf-8")) if manifest.exists() else {}
    clips = HERE / "clips" / args.res
    clips.mkdir(parents=True, exist_ok=True)
    active_path = HERE / f"active_{args.res}.json"

    # Resume: a prompt was submitted by a previous run but never harvested.
    if active_path.exists():
        active = json.loads(active_path.read_text(encoding="utf-8"))
        if active.get("state") == "submitted":
            scene = plan[int(active["scene"])]
            number = int(scene["id"])
            destination = clips / f"scene{number:02}.mp4"
            print(json.dumps({"resume": active}), flush=True)
            started = time.monotonic()
            item = wait_for(active["prompt_id"], scene["id"], started)
            harvest(item, scene, args.res, cfg, destination, active.get("seed"),
                    resolve_first(scene["first"], args.res), active["prompt_id"], started, records, manifest)
            active["state"] = "completed"
            active_path.write_text(json.dumps(active), encoding="utf-8")

    queue = request_json("/queue")
    if queue["queue_running"] or queue["queue_pending"]:
        raise RuntimeError("An existing ComfyUI queue is active; left untouched.")

    for number in sorted(plan):
        scene = plan[number]
        if not args.start <= number <= args.end:
            continue
        destination = clips / f"scene{number:02}.mp4"
        if scene["id"] in records and destination.exists():
            if hashlib.sha256(destination.read_bytes()).hexdigest() != records[scene["id"]]["sha256"]:
                raise RuntimeError(f"Cached scene {number} was modified.")
            print(f"Verified cached scene {number}", flush=True)
            continue
        if destination.exists():
            raise RuntimeError(f"Unregistered existing clip {destination}; inspect before overwrite.")
        first = resolve_first(scene["first"], args.res)
        if not (INPUT_ROOT / first).exists():
            raise FileNotFoundError(INPUT_ROOT / first)
        seed = 931000 + number * 137 + args.seed_offset
        graph = make_graph(scene["prompt"], seed, f"AuditFutureV1/{args.res}/scene{number:02}", first,
                           cfg["width"], cfg["height"], cfg["steps"])
        (HERE / "graphs").mkdir(exist_ok=True)
        (HERE / "graphs" / f"graph_{args.res}_{number:02}.json").write_text(json.dumps(graph, indent=2), encoding="utf-8")
        queued = request_json("/prompt", {"prompt": graph, "client_id": PROJECT})
        prompt_id = queued["prompt_id"]
        active = {"scene": scene["id"], "prompt_id": prompt_id, "state": "submitted", "seed": seed}
        active_path.write_text(json.dumps(active), encoding="utf-8")
        started = time.monotonic()
        print(json.dumps(active), flush=True)
        item = wait_for(prompt_id, scene["id"], started)
        harvest(item, scene, args.res, cfg, destination, seed, first, prompt_id, started, records, manifest)
        active["state"] = "completed"
        active_path.write_text(json.dumps(active), encoding="utf-8")


if __name__ == "__main__":
    main()
