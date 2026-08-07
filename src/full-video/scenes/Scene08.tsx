import {SceneVideo} from "../SceneVideo";
import {AbsoluteFill, Img, Sequence, staticFile} from "remotion";

export const Scene08: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: "#050707"}}>
    <Sequence durationInFrames={120}>
      <SceneVideo src="accounting-future/clip08.mp4" />
    </Sequence>
    <Sequence from={120}>
      <Img
        src={staticFile("accounting-future/end-card-hold.png")}
        style={{width: "100%", height: "100%", objectFit: "cover"}}
      />
    </Sequence>
  </AbsoluteFill>
);
