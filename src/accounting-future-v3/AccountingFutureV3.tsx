import {Audio} from "@remotion/media";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {AbsoluteFill, Sequence, interpolate, staticFile} from "remotion";
import {Scene01} from "./scenes/Scene01";
import {Scene02} from "./scenes/Scene02";
import {Scene03} from "./scenes/Scene03";
import {Scene04} from "./scenes/Scene04";
import {Scene05} from "./scenes/Scene05";
import {Scene06} from "./scenes/Scene06";
import {Scene07} from "./scenes/Scene07";

const transitionTiming = linearTiming({durationInFrames: 6});

export const AccountingFutureV3: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: "#050707"}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={192} name="Current workload">
          <Scene01 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />
        <TransitionSeries.Sequence durationInFrames={192} name="Closing pressure">
          <Scene02 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />
        <TransitionSeries.Sequence durationInFrames={192} name="Agent handoff">
          <Scene03 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />
        <TransitionSeries.Sequence durationInFrames={192} name="Overnight automation">
          <Scene04 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />
        <TransitionSeries.Sequence durationInFrames={192} name="Exception judgment">
          <Scene05 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />
        <TransitionSeries.Sequence durationInFrames={192} name="Higher-value work">
          <Scene06 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transitionTiming} />
        <TransitionSeries.Sequence durationInFrames={192} name="Deloitte end card">
          <Scene07 />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Audio
        src={staticFile("accounting-future-v3/bgm.wav")}
        volume={(frame) =>
          interpolate(frame, [0, 48, 1180, 1307], [0, 0.11, 0.11, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      {[8, 194, 380, 566, 752, 938, 1124].map((from, index) => (
        <Sequence key={from} from={from} layout="none">
          <Audio
            src={staticFile(`accounting-future-v3/nar${String(index + 1).padStart(2, "0")}.wav`)}
            volume={1}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const ACCOUNTING_FUTURE_V3_DURATION = 1308;
