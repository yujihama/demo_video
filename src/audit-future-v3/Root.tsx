import {Composition, Folder} from "remotion";
import {ScreenAsk, ScreenDeepen, ScreenDrilldown, ScreenIssues, ScreenOutputs, ScreenTop} from "./screens";
import {ScreenNext} from "./next";

export const AuditFutureV3Root: React.FC = () => (
  <Folder name="AuditFutureV3Screens">
    <Composition id="V3Top" component={ScreenTop} width={1920} height={1080} fps={24} durationInFrames={192} />
    <Composition id="V3Drilldown" component={ScreenDrilldown} width={1920} height={1080} fps={24} durationInFrames={192} />
    <Composition id="V3Ask" component={ScreenAsk} width={1920} height={1080} fps={24} durationInFrames={192} />
    <Composition id="V3Issues" component={ScreenIssues} width={1920} height={1080} fps={24} durationInFrames={192} />
    <Composition id="V3Deepen" component={ScreenDeepen} width={1920} height={1080} fps={24} durationInFrames={192} />
    <Composition id="V3Outputs" component={ScreenOutputs} width={1920} height={1080} fps={24} durationInFrames={192} />
    <Composition id="V3Next" component={ScreenNext} width={1920} height={1080} fps={24} durationInFrames={192} />
  </Folder>
);
