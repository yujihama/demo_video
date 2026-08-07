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
import {Scene08} from "./scenes/Scene08";

const transitionTiming = linearTiming({durationInFrames: 6});

export const AccountingFutureFilm: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: "#050707"}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={124} name="Current pressure">
          <Scene01 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />
        <TransitionSeries.Sequence durationInFrames={192} name="Desk work">
          <Scene02 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />
        <TransitionSeries.Sequence durationInFrames={192} name="Agent overnight">
          <Scene03 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />
        <TransitionSeries.Sequence durationInFrames={192} name="Exception review">
          <Scene04 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />
        <TransitionSeries.Sequence durationInFrames={192} name="Automatic reconciliation">
          <Scene05 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />
        <TransitionSeries.Sequence durationInFrames={192} name="Forecasting">
          <Scene06 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />
        <TransitionSeries.Sequence durationInFrames={192} name="Business partner">
          <Scene07 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />
        <TransitionSeries.Sequence durationInFrames={120} name="Deloitte end card">
          <Scene08 />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Audio
        src={staticFile("accounting-future/bgm.wav")}
        volume={(frame) =>
          interpolate(frame, [0, 48, 1252, 1353], [0, 0.11, 0.11, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      <Sequence from={8} layout="none">
        <Audio src={staticFile("accounting-future/nar01.wav")} volume={1} />
      </Sequence>
      <Sequence from={126} layout="none">
        <Audio src={staticFile("accounting-future/nar02.wav")} volume={1} />
      </Sequence>
      <Sequence from={312} layout="none">
        <Audio src={staticFile("accounting-future/nar03.wav")} volume={1} />
      </Sequence>
      <Sequence from={498} layout="none">
        <Audio src={staticFile("accounting-future/nar04.wav")} volume={1} />
      </Sequence>
      <Sequence from={684} layout="none">
        <Audio src={staticFile("accounting-future/nar05.wav")} volume={1} />
      </Sequence>
      <Sequence from={870} layout="none">
        <Audio src={staticFile("accounting-future/nar06.wav")} volume={1} />
      </Sequence>
      <Sequence from={1056} layout="none">
        <Audio src={staticFile("accounting-future/nar07.wav")} volume={1} />
      </Sequence>
      <Sequence from={1242} layout="none">
        <Audio src={staticFile("accounting-future/nar08.wav")} volume={1} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const ACCOUNTING_FUTURE_DURATION = 1354;
