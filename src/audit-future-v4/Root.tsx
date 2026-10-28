import {Composition, Folder} from "remotion";
import {ScreenAsk, ScreenDrilldown, ScreenTop} from "./screens";
import {ScreenDeepen, ScreenIssues, ScreenTablet, ScreenWall} from "./screens2";
import {ScreenOutputs} from "./screens3";
import {ScreenNext} from "./next";
import {ScreenReport, ScreenReportTablet} from "./report";
import {Hook} from "./hook";
import {LineTest} from "./test";

const S = {width: 1920, height: 1080, fps: 24} as const;
const TAB = {width: 1600, height: 1200, fps: 24} as const;

export const AuditFutureV4Root: React.FC = () => (
  <Folder name="AuditFutureV4Screens">
    <Composition id="V4Hook" component={Hook} {...S} durationInFrames={72} />
    <Composition id="V4Top" component={ScreenTop} {...S} durationInFrames={192} />
    <Composition id="V4Drilldown" component={ScreenDrilldown} {...S} durationInFrames={192} />
    <Composition id="V4Ask" component={ScreenAsk} {...S} durationInFrames={384} />
    <Composition id="V4Issues" component={ScreenIssues} {...S} durationInFrames={192} />
    <Composition id="V4Tablet" component={ScreenTablet} {...TAB} durationInFrames={192} />
    <Composition id="V4Deepen" component={ScreenDeepen} {...S} durationInFrames={384} />
    <Composition id="V4Wall" component={ScreenWall} {...S} durationInFrames={192} />
    <Composition id="V4Outputs" component={ScreenOutputs} {...S} durationInFrames={384} />
    <Composition id="V4Next" component={ScreenNext} {...S} durationInFrames={192} />
    <Composition id="V4Report" component={ScreenReport} {...S} durationInFrames={192} />
    <Composition id="V4ReportTablet" component={ScreenReportTablet} {...TAB} durationInFrames={96} />
    <Composition id="V4LineTest" component={LineTest} {...S} durationInFrames={192} />
  </Folder>
);
