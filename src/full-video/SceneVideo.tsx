import {Video} from "@remotion/media";
import {AbsoluteFill, staticFile} from "remotion";

type SceneVideoProps = {
  readonly src: string;
};

export const SceneVideo: React.FC<SceneVideoProps> = ({src}) => {
  return (
    <AbsoluteFill style={{backgroundColor: "#050707"}}>
      <Video
        src={staticFile(src)}
        muted
        objectFit="cover"
        style={{width: "100%", height: "100%"}}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.16) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
