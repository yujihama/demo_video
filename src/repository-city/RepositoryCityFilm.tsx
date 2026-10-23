import {Audio} from "@remotion/media";
import {AbsoluteFill, Series, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {repositoryScenes, REPOSITORY_CITY_DURATION, SCENE_DURATION} from "./data";
import {
  Scene01,
  Scene02,
  Scene03,
  Scene04,
  Scene05,
  Scene06,
  Scene07,
  Scene08,
  Scene09,
  Scene10,
  Scene11,
  Scene12,
  Scene13,
  Scene14,
  Scene15,
  Scene16,
  Scene17,
  Scene18,
  Scene19,
  Scene20,
  Scene21,
  Scene22,
  Scene23,
  Scene24,
  Scene25,
  Scene26,
  Scene27,
  Scene28,
  Scene29,
  Scene30,
  Scene31,
  Scene32,
  Scene33,
  Scene34,
  Scene35,
  Scene36,
  Scene37,
  Scene38,
} from "./scenes";

const sceneComponents = [
  Scene01,
  Scene02,
  Scene03,
  Scene04,
  Scene05,
  Scene06,
  Scene07,
  Scene08,
  Scene09,
  Scene10,
  Scene11,
  Scene12,
  Scene13,
  Scene14,
  Scene15,
  Scene16,
  Scene17,
  Scene18,
  Scene19,
  Scene20,
  Scene21,
  Scene22,
  Scene23,
  Scene24,
  Scene25,
  Scene26,
  Scene27,
  Scene28,
  Scene29,
  Scene30,
  Scene31,
  Scene32,
  Scene33,
  Scene34,
  Scene35,
  Scene36,
  Scene37,
  Scene38,
];

const narrationStarts = [12, 588, 1548, 3276, 4428, 5964, 6732];

export const RepositoryCityFilm: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: "#050914"}}>
      <Series>
        {sceneComponents.map((Scene, index) => (
          <Series.Sequence
            key={repositoryScenes[index].index}
            durationInFrames={SCENE_DURATION}
            name={`${String(index + 1).padStart(2, "0")} ${repositoryScenes[index].repository}`}
          >
            <Scene />
          </Series.Sequence>
        ))}
      </Series>

      <Audio
        src={staticFile("accounting-future-v3/bgm.wav")}
        loop
        volume={interpolate(
          frame,
          [0, 72, REPOSITORY_CITY_DURATION - 144, REPOSITORY_CITY_DURATION - 1],
          [0, 0.085, 0.085, 0],
          {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
        )}
      />

      {narrationStarts.map((from, index) => (
        <Sequence key={from} from={from} layout="none">
          <Audio
            src={staticFile(`repository-city-5min/narration-${String(index + 1).padStart(2, "0")}.wav`)}
            volume={1}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export {REPOSITORY_CITY_DURATION};
