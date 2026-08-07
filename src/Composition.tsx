import {
  AbsoluteFill,
  CanvasImage,
  Composition,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {Video} from "@remotion/media";
import {
  ACCOUNTING_FUTURE_DURATION,
  AccountingFutureFilm,
} from "./full-video/AccountingFutureFilm";

const GREEN = "#86bc25";

const nodes = [
  {x: 52, y: 65, delay: 2, size: 3},
  {x: 118, y: 42, delay: 8, size: 2},
  {x: 177, y: 86, delay: 13, size: 3},
  {x: 438, y: 54, delay: 6, size: 2},
  {x: 510, y: 93, delay: 11, size: 3},
  {x: 560, y: 48, delay: 16, size: 2},
  {x: 84, y: 287, delay: 9, size: 2},
  {x: 154, y: 316, delay: 4, size: 3},
  {x: 459, y: 303, delay: 14, size: 2},
  {x: 539, y: 274, delay: 7, size: 3},
];

const lines = [
  [52, 65, 177, 86],
  [118, 42, 177, 86],
  [438, 54, 510, 93],
  [510, 93, 560, 48],
  [84, 287, 154, 316],
  [459, 303, 539, 274],
  [154, 316, 254, 264],
  [354, 267, 459, 303],
];

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050707",
        color: "white",
        fontFamily:
          '"Segoe UI", "Noto Sans JP", "Yu Gothic UI", "Yu Gothic", sans-serif',
        overflow: "hidden",
      }}
    >
      <Video
        src={staticFile("office-background.mp4")}
        trimBefore={72}
        durationInFrames={120}
        muted
        objectFit="cover"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: interpolate(frame, [0, 22], [0, 0.44], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          filter: "saturate(0.58) brightness(0.92) contrast(1.05) blur(0.6px)",
          scale: 1.025,
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(2,8,7,0.62) 0%, rgba(3,11,9,0.48) 44%, rgba(1,6,5,0.66) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          opacity: interpolate(frame, [0, 26], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          background:
            "radial-gradient(circle at 50% 44%, rgba(31,68,58,0.42) 0%, rgba(11,25,22,0.25) 36%, rgba(5,7,7,0) 72%)",
        }}
      />

      <svg
        width="608"
        height="352"
        viewBox="0 0 608 352"
        style={{position: "absolute", inset: 0}}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#86bc25" stopOpacity="0.08" />
            <stop offset="0.5" stopColor="#65c9b6" stopOpacity="0.34" />
            <stop offset="1" stopColor="#86bc25" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        {lines.map(([x1, y1, x2, y2], index) => (
          <line
            key={`${x1}-${y1}-${x2}-${y2}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#lineGradient)"
            strokeWidth="1"
            strokeDasharray="150"
            strokeDashoffset={interpolate(frame, [index * 2, 40 + index * 2], [150, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            })}
            opacity={interpolate(frame, [0, 26, 104, 119], [0, 0.8, 0.8, 0.35], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />
        ))}
      </svg>

      {nodes.map((node, index) => (
        <div
          key={`${node.x}-${node.y}`}
          style={{
            position: "absolute",
            left: node.x,
            top: node.y,
            width: node.size,
            height: node.size,
            borderRadius: "50%",
            backgroundColor: index % 3 === 0 ? GREEN : "#65c9b6",
            opacity: interpolate(
              frame,
              [node.delay, node.delay + 20, 106, 119],
              [0, 0.78, 0.78, 0.28],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
            scale: interpolate(frame, [node.delay, node.delay + 24], [0.2, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            boxShadow: `0 0 ${8 + node.size * 2}px rgba(134,188,37,0.55)`,
          }}
        />
      ))}

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.38) 100%)",
        }}
      />

      <Interactive.Div
        name="Main message"
        style={{
          position: "absolute",
          left: 48,
          right: 48,
          top: 77,
          textAlign: "center",
          opacity: interpolate(frame, [12, 34], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [12, 36], ["0px 12px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <div
          style={{
            fontSize: 27,
            fontWeight: 650,
            letterSpacing: "0.02em",
            lineHeight: 1.42,
            textShadow: "0 4px 22px rgba(0,0,0,0.7)",
          }}
        >
          経理の変革を、
          <br />
          私たちが支援します。
        </div>
      </Interactive.Div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 166,
          width: interpolate(frame, [32, 56], [0, 112], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          height: 1,
          translate: "-50% 0",
          background:
            "linear-gradient(90deg, rgba(134,188,37,0), #86bc25, rgba(134,188,37,0))",
          boxShadow: "0 0 12px rgba(134,188,37,0.34)",
        }}
      />

      <Interactive.Div
        name="Team name"
        style={{
          position: "absolute",
          left: 42,
          right: 42,
          top: 188,
          textAlign: "center",
          opacity: interpolate(frame, [42, 66], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(frame, [42, 68], ["0px 9px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        <div
          style={{
            fontSize: 16.5,
            fontWeight: 600,
            letterSpacing: "0.035em",
            lineHeight: 1.45,
          }}
        >
          Deloitte Analytics &amp; Digital Governance
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.72)",
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "0.17em",
            lineHeight: 1.55,
            textTransform: "uppercase",
          }}
        >
          Technology Team
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Deloitte logo"
        style={{
          position: "absolute",
          left: "50%",
          top: 265,
          width: 142,
          height: 27,
          translate: "-50% 0",
          opacity: interpolate(frame, [64, 88], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [64, 92], [0.94, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          filter: `drop-shadow(0 0 ${interpolate(frame, [64, 88, 110], [18, 8, 4], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}px rgba(134,188,37,0.2))`,
        }}
      >
        <CanvasImage
          src={staticFile("deloitte.svg")}
          style={{width: 142, height: 27}}
        />
      </Interactive.Div>

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          boxShadow: "inset 0 0 90px rgba(0,0,0,0.82)",
          opacity: interpolate(frame, [0, 20], [1, 0.52], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};

export const MyComposition: React.FC = () => {
  return (
    <>
      <Composition
        id="AccountingFutureEndCard"
        component={EndCard}
        durationInFrames={120}
        fps={24}
        width={608}
        height={352}
      />
      <Composition
        id="AccountingFutureFilm"
        component={AccountingFutureFilm}
        durationInFrames={ACCOUNTING_FUTURE_DURATION}
        fps={24}
        width={608}
        height={352}
      />
    </>
  );
};
