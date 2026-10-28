// Frame numbers (24 fps) that must line up with gestures in the generated person clips.
// Provisional values; replace after reading the clips (production/audit_future_v4/timing.json).
export const T = {
  top: {tap1: 64, tap2: 112, p1: [1126, 673], p2: [710, 674]}, // P1 (scene01 read): fingertip over the chart at f64, moves left and taps at f112
  ask: {speakStart: 20, speakEnd: 112, answer: 150, cite: 270, close: 340}, // P2 uses 0–191, S3 uses 192–383
  drill: {press: 72, ask: 150},
  issues: {run: 60},
  tablet: {swipes: [22, 58, 110], tips: [[713, 527], [753, 462], [725, 412]]}, // P3 (scene03 read): upward strokes start at these frames
  deepen: {arrive: [36, 72, 124]},       // cards land on the big display 14 frames after each swipe
  wall: {share: 40},                      // P4 (scene04 read): tablet raised and swiped at f40
  approve: {tap: 40, p1: [697, 565], reason: 60, tap2: 130, p2: [740, 625], done: 150}, // P5 (scene05 read): hand on the wall at f40 and f128, lowered after f156
  report: {trace: 6, traceEnd: 48, add: 68, p1: [675, 850], p2: [712, 803]}, // P8 (scene08 frames 36-107): finger traces left to right, lifts, taps
};
