import {Audio} from "@remotion/media";
import {AbsoluteFill, Series, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {HOKKAIDO_VLOG_DURATION, hokkaidoScenes, SCENE_DURATION} from "./data";
import {Scene01, Scene02, Scene03, Scene04, Scene05, Scene06, Scene07, Scene08, Scene09, Scene10, Scene11, Scene12, Scene13, Scene14, Scene15} from "./scenes";

const sceneComponents = [Scene01, Scene02, Scene03, Scene04, Scene05, Scene06, Scene07, Scene08, Scene09, Scene10, Scene11, Scene12, Scene13, Scene14, Scene15];
const narrationStarts = [12, 588, 1164, 1740, 2316];
const narrationEnds = [524, 1031, 1553, 2110, 2739];

export const HokkaidoVlogFilm: React.FC = () => {
  const frame = useCurrentFrame();
  const narrationIsActive = narrationStarts.some((start, index) => frame >= start && frame <= narrationEnds[index]);
  const baseBgm = narrationIsActive ? 0.035 : 0.075;

  return (
    <AbsoluteFill style={{backgroundColor: "#05090c"}}>
      <Series>
        {sceneComponents.map((Scene, index) => (
          <Series.Sequence key={hokkaidoScenes[index].index} durationInFrames={SCENE_DURATION} name={`${String(index + 1).padStart(2, "0")} ${hokkaidoScenes[index].location}`}>
            <Scene />
          </Series.Sequence>
        ))}
      </Series>

      <Audio
        src={staticFile("accounting-future-v3/bgm.wav")}
        loop
        volume={() => interpolate(frame, [0, 48, HOKKAIDO_VLOG_DURATION - 96, HOKKAIDO_VLOG_DURATION - 1], [0, baseBgm, baseBgm, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}
      />

      {narrationStarts.map((from, index) => (
        <Sequence key={from} from={from} layout="none">
          <Audio src={staticFile(`hokkaido-vlog/audio/narration-${String(index + 1).padStart(2, "0")}.wav`)} volume={1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export {HOKKAIDO_VLOG_DURATION};
