export type StrokeCmd =
  | { type: 'M'; x: number; y: number }
  | { type: 'L'; x: number; y: number }
  | {
      type: 'C';
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      x: number;
      y: number;
    };

export interface StrokePath {
  commands: StrokeCmd[];
  startDot?: [number, number];
}

interface GlyphDef {
  width: number;
  strokes: StrokeCmd[][];
}

/**
 * Generates cubic Bezier commands approximating an elliptical arc in top-down screen space.
 * Angles are in degrees: 0 = right (3 o'clock), 90 = bottom (6 o'clock),
 * 180 = left (9 o'clock), 270 = top (12 o'clock).
 */
export function ellipseArc(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  startDeg: number,
  endDeg: number,
  includeMove = true
): StrokeCmd[] {
  const cmds: StrokeCmd[] = [];
  const totalDeg = endDeg - startDeg;
  const segments = Math.max(1, Math.ceil(Math.abs(totalDeg) / 90));
  const stepRad = ((totalDeg * Math.PI) / 180) / segments;
  const startRad = (startDeg * Math.PI) / 180;

  if (includeMove) {
    cmds.push({
      type: 'M',
      x: cx + rx * Math.cos(startRad),
      y: cy + ry * Math.sin(startRad),
    });
  }

  for (let i = 0; i < segments; i++) {
    const a1 = startRad + i * stepRad;
    const a2 = a1 + stepRad;
    const alpha = (4 / 3) * Math.tan(stepRad / 4);

    const cos1 = Math.cos(a1);
    const sin1 = Math.sin(a1);
    const cos2 = Math.cos(a2);
    const sin2 = Math.sin(a2);

    cmds.push({
      type: 'C',
      x1: cx + rx * (cos1 - alpha * sin1),
      y1: cy + ry * (sin1 + alpha * cos1),
      x2: cx + rx * (cos2 + alpha * sin2),
      y2: cy + ry * (sin2 - alpha * cos2),
      x: cx + rx * cos2,
      y: cy + ry * sin2,
    });
  }

  return cmds;
}

function line(x1: number, y1: number, x2: number, y2: number): StrokeCmd[] {
  return [
    { type: 'M', x: x1, y: y1 },
    { type: 'L', x: x2, y: y2 },
  ];
}

function poly(...pts: Array<[number, number]>): StrokeCmd[] {
  if (pts.length === 0) return [];
  const [fx, fy] = pts[0];
  const cmds: StrokeCmd[] = [{ type: 'M', x: fx, y: fy }];
  for (let i = 1; i < pts.length; i++) {
    cmds.push({ type: 'L', x: pts[i][0], y: pts[i][1] });
  }
  return cmds;
}

const MID = 0.48;
const LOWER_CY = (MID + 1.0) / 2; // 0.74
const LOWER_RY = (1.0 - MID) / 2; // 0.26

const GLYPHS: Record<string, GlyphDef> = {
  // Uppercase A-Z (top y=0, midline y=0.48, baseline y=1.0)
  A: {
    width: 0.72,
    strokes: [line(0.36, 0, 0.04, 1), line(0.36, 0, 0.68, 1), line(0.15, 0.62, 0.57, 0.62)],
  },
  B: {
    width: 0.66,
    strokes: [
      line(0.08, 0, 0.08, 1),
      [
        { type: 'M', x: 0.08, y: 0 },
        { type: 'L', x: 0.34, y: 0 },
        ...ellipseArc(0.34, 0.24, 0.24, 0.24, 270, 450, false),
        { type: 'L', x: 0.08, y: 0.48 },
      ],
      [
        { type: 'M', x: 0.08, y: 0.48 },
        { type: 'L', x: 0.37, y: 0.48 },
        ...ellipseArc(0.37, 0.74, 0.26, 0.26, 270, 450, false),
        { type: 'L', x: 0.08, y: 1 },
      ],
    ],
  },
  C: {
    width: 0.68,
    strokes: [ellipseArc(0.38, 0.5, 0.32, 0.5, 325, 35)],
  },
  D: {
    width: 0.7,
    strokes: [
      line(0.08, 0, 0.08, 1),
      [
        { type: 'M', x: 0.08, y: 0 },
        { type: 'L', x: 0.26, y: 0 },
        ...ellipseArc(0.26, 0.5, 0.38, 0.5, 270, 450, false),
        { type: 'L', x: 0.08, y: 1 },
      ],
    ],
  },
  E: {
    width: 0.6,
    strokes: [
      line(0.08, 0, 0.08, 1),
      line(0.08, 0, 0.54, 0),
      line(0.08, 0.48, 0.48, 0.48),
      line(0.08, 1, 0.56, 1),
    ],
  },
  F: {
    width: 0.58,
    strokes: [line(0.08, 0, 0.08, 1), line(0.08, 0, 0.54, 0), line(0.08, 0.48, 0.46, 0.48)],
  },
  G: {
    width: 0.72,
    strokes: [
      ellipseArc(0.38, 0.5, 0.32, 0.5, 325, 0),
      line(0.42, 0.54, 0.7, 0.54),
      line(0.7, 0.54, 0.7, 1.0),
    ],
  },
  H: {
    width: 0.68,
    strokes: [line(0.08, 0, 0.08, 1), line(0.6, 0, 0.6, 1), line(0.08, 0.48, 0.6, 0.48)],
  },
  I: {
    width: 0.42,
    strokes: [line(0.21, 0, 0.21, 1), line(0.06, 0, 0.36, 0), line(0.06, 1, 0.36, 1)],
  },
  J: {
    width: 0.56,
    strokes: [
      [
        { type: 'M', x: 0.44, y: 0 },
        { type: 'L', x: 0.44, y: 0.76 },
        ...ellipseArc(0.25, 0.76, 0.19, 0.24, 0, 170, false),
      ],
      line(0.22, 0, 0.52, 0),
    ],
  },
  K: {
    width: 0.66,
    strokes: [line(0.08, 0, 0.08, 1), line(0.58, 0, 0.08, 0.52), line(0.22, 0.38, 0.6, 1)],
  },
  L: {
    width: 0.56,
    strokes: [poly([0.08, 0], [0.08, 1], [0.52, 1])],
  },
  M: {
    width: 0.82,
    strokes: [
      line(0.08, 0, 0.08, 1),
      poly([0.08, 0], [0.41, 0.68], [0.74, 0]),
      line(0.74, 0, 0.74, 1),
    ],
  },
  N: {
    width: 0.7,
    strokes: [line(0.08, 0, 0.08, 1), line(0.08, 0, 0.62, 1), line(0.62, 0, 0.62, 1)],
  },
  O: {
    width: 0.74,
    strokes: [ellipseArc(0.37, 0.5, 0.31, 0.5, 270, -90)],
  },
  P: {
    width: 0.64,
    strokes: [
      line(0.08, 0, 0.08, 1),
      [
        { type: 'M', x: 0.08, y: 0 },
        { type: 'L', x: 0.33, y: 0 },
        ...ellipseArc(0.33, 0.26, 0.25, 0.26, 270, 450, false),
        { type: 'L', x: 0.08, y: 0.52 },
      ],
    ],
  },
  Q: {
    width: 0.74,
    strokes: [ellipseArc(0.37, 0.5, 0.31, 0.5, 270, -90), line(0.44, 0.74, 0.68, 1.04)],
  },
  R: {
    width: 0.66,
    strokes: [
      line(0.08, 0, 0.08, 1),
      [
        { type: 'M', x: 0.08, y: 0 },
        { type: 'L', x: 0.33, y: 0 },
        ...ellipseArc(0.33, 0.25, 0.25, 0.25, 270, 450, false),
        { type: 'L', x: 0.08, y: 0.5 },
      ],
      line(0.3, 0.5, 0.6, 1),
    ],
  },
  S: {
    width: 0.62,
    strokes: [
      [
        { type: 'M', x: 0.54, y: 0.16 },
        { type: 'C', x1: 0.48, y1: -0.04, x2: 0.1, y2: -0.02, x: 0.1, y: 0.22 },
        { type: 'C', x1: 0.1, y1: 0.48, x2: 0.56, y2: 0.48, x: 0.56, y: 0.76 },
        { type: 'C', x1: 0.56, y1: 1.03, x2: 0.12, y2: 1.04, x: 0.06, y: 0.84 },
      ],
    ],
  },
  T: {
    width: 0.62,
    strokes: [line(0.04, 0, 0.58, 0), line(0.31, 0, 0.31, 1)],
  },
  U: {
    width: 0.7,
    strokes: [
      [
        { type: 'M', x: 0.08, y: 0 },
        { type: 'L', x: 0.08, y: 0.66 },
        ...ellipseArc(0.35, 0.66, 0.27, 0.34, 180, 0, false),
        { type: 'L', x: 0.62, y: 0 },
      ],
    ],
  },
  V: {
    width: 0.68,
    strokes: [poly([0.05, 0], [0.34, 1], [0.63, 0])],
  },
  W: {
    width: 0.88,
    strokes: [poly([0.05, 0], [0.24, 1], [0.44, 0.34], [0.64, 1], [0.83, 0])],
  },
  X: {
    width: 0.64,
    strokes: [line(0.06, 0, 0.58, 1), line(0.58, 0, 0.06, 1)],
  },
  Y: {
    width: 0.64,
    strokes: [poly([0.05, 0], [0.32, 0.52], [0.59, 0]), line(0.32, 0.52, 0.32, 1)],
  },
  Z: {
    width: 0.64,
    strokes: [poly([0.06, 0], [0.58, 0], [0.06, 1], [0.58, 1])],
  },

  // Lowercase a-z (ball-and-stick preschool forms)
  a: {
    width: 0.58,
    strokes: [
      ellipseArc(0.28, LOWER_CY, 0.22, LOWER_RY, 330, 0),
      line(0.5, MID, 0.5, 1),
    ],
  },
  b: {
    width: 0.58,
    strokes: [
      line(0.08, 0, 0.08, 1),
      ellipseArc(0.3, LOWER_CY, 0.22, LOWER_RY, 210, 510),
    ],
  },
  c: {
    width: 0.52,
    strokes: [ellipseArc(0.29, LOWER_CY, 0.22, LOWER_RY, 325, 35)],
  },
  d: {
    width: 0.58,
    strokes: [
      ellipseArc(0.28, LOWER_CY, 0.22, LOWER_RY, 330, 30),
      line(0.5, 0, 0.5, 1),
    ],
  },
  e: {
    width: 0.56,
    strokes: [
      [
        { type: 'M', x: 0.07, y: LOWER_CY },
        { type: 'L', x: 0.49, y: LOWER_CY },
        ...ellipseArc(0.28, LOWER_CY, 0.21, LOWER_RY, 0, -325, false),
      ],
    ],
  },
  f: {
    width: 0.42,
    strokes: [
      [
        ...ellipseArc(0.29, 0.16, 0.11, 0.16, 330, 180, true),
        { type: 'L', x: 0.18, y: 1 },
      ],
      line(0.05, MID, 0.36, MID),
    ],
  },
  g: {
    width: 0.58,
    strokes: [
      ellipseArc(0.28, LOWER_CY, 0.22, LOWER_RY, 330, 0),
      [
        { type: 'M', x: 0.5, y: MID },
        { type: 'L', x: 0.5, y: 1.08 },
        ...ellipseArc(0.29, 1.08, 0.21, 0.22, 0, 155, false),
      ],
    ],
  },
  h: {
    width: 0.56,
    strokes: [
      line(0.08, 0, 0.08, 1),
      [
        { type: 'M', x: 0.08, y: 0.7 },
        ...ellipseArc(0.28, 0.7, 0.2, 0.22, 180, 360, false),
        { type: 'L', x: 0.48, y: 1 },
      ],
    ],
  },
  i: {
    width: 0.26,
    strokes: [line(0.13, MID, 0.13, 1), line(0.13, 0.24, 0.13, 0.27)],
  },
  j: {
    width: 0.34,
    strokes: [
      [
        { type: 'M', x: 0.24, y: MID },
        { type: 'L', x: 0.24, y: 1.08 },
        ...ellipseArc(0.13, 1.08, 0.11, 0.22, 0, 155, false),
      ],
      line(0.24, 0.24, 0.24, 0.27),
    ],
  },
  k: {
    width: 0.5,
    strokes: [line(0.08, 0, 0.08, 1), line(0.44, MID, 0.08, 0.76), line(0.2, 0.68, 0.46, 1)],
  },
  l: {
    width: 0.26,
    strokes: [line(0.13, 0, 0.13, 1)],
  },
  m: {
    width: 0.82,
    strokes: [
      line(0.08, MID, 0.08, 1),
      [
        { type: 'M', x: 0.08, y: 0.68 },
        ...ellipseArc(0.25, 0.68, 0.17, 0.2, 180, 360, false),
        { type: 'L', x: 0.42, y: 1 },
      ],
      [
        { type: 'M', x: 0.42, y: 0.68 },
        ...ellipseArc(0.58, 0.68, 0.16, 0.2, 180, 360, false),
        { type: 'L', x: 0.74, y: 1 },
      ],
    ],
  },
  n: {
    width: 0.56,
    strokes: [
      line(0.08, MID, 0.08, 1),
      [
        { type: 'M', x: 0.08, y: 0.7 },
        ...ellipseArc(0.28, 0.7, 0.2, 0.22, 180, 360, false),
        { type: 'L', x: 0.48, y: 1 },
      ],
    ],
  },
  o: {
    width: 0.56,
    strokes: [ellipseArc(0.28, LOWER_CY, 0.22, LOWER_RY, 270, -90)],
  },
  p: {
    width: 0.58,
    strokes: [
      line(0.08, MID, 0.08, 1.3),
      ellipseArc(0.3, LOWER_CY, 0.22, LOWER_RY, 210, 510),
    ],
  },
  q: {
    width: 0.58,
    strokes: [
      ellipseArc(0.28, LOWER_CY, 0.22, LOWER_RY, 330, 0),
      line(0.5, MID, 0.5, 1.3),
    ],
  },
  r: {
    width: 0.4,
    strokes: [
      line(0.08, MID, 0.08, 1),
      [
        { type: 'M', x: 0.08, y: 0.7 },
        ...ellipseArc(0.24, 0.7, 0.16, 0.22, 180, 325, false),
      ],
    ],
  },
  s: {
    width: 0.48,
    strokes: [
      [
        { type: 'M', x: 0.4, y: 0.56 },
        { type: 'C', x1: 0.36, y1: 0.45, x2: 0.09, y2: 0.46, x: 0.09, y: 0.6 },
        { type: 'C', x1: 0.09, y1: 0.74, x2: 0.42, y2: 0.74, x: 0.42, y: 0.88 },
        { type: 'C', x1: 0.42, y1: 1.02, x2: 0.1, y2: 1.03, x: 0.06, y: 0.91 },
      ],
    ],
  },
  t: {
    width: 0.38,
    strokes: [line(0.18, 0.1, 0.18, 1), line(0.04, MID, 0.34, MID)],
  },
  u: {
    width: 0.56,
    strokes: [
      [
        { type: 'M', x: 0.08, y: MID },
        { type: 'L', x: 0.08, y: 0.78 },
        ...ellipseArc(0.28, 0.78, 0.2, 0.22, 180, 0, false),
        { type: 'L', x: 0.48, y: MID },
      ],
      line(0.48, MID, 0.48, 1),
    ],
  },
  v: {
    width: 0.52,
    strokes: [poly([0.05, MID], [0.26, 1], [0.47, MID])],
  },
  w: {
    width: 0.74,
    strokes: [poly([0.05, MID], [0.21, 1], [0.37, 0.58], [0.53, 1], [0.69, MID])],
  },
  x: {
    width: 0.5,
    strokes: [line(0.06, MID, 0.44, 1), line(0.44, MID, 0.06, 1)],
  },
  y: {
    width: 0.54,
    strokes: [poly([0.06, MID], [0.27, 1], [0.48, MID]), line(0.27, 1, 0.13, 1.3)],
  },
  z: {
    width: 0.5,
    strokes: [poly([0.06, MID], [0.44, MID], [0.06, 1], [0.44, 1])],
  },

  // Digits & basic name punctuation
  '0': {
    width: 0.6,
    strokes: [ellipseArc(0.3, 0.5, 0.23, 0.5, 270, -90)],
  },
  '1': {
    width: 0.42,
    strokes: [line(0.12, 0.18, 0.25, 0), line(0.25, 0, 0.25, 1)],
  },
  '2': {
    width: 0.58,
    strokes: [
      [
        ...ellipseArc(0.29, 0.25, 0.22, 0.25, 200, 385, true),
        { type: 'L', x: 0.06, y: 1 },
        { type: 'L', x: 0.52, y: 1 },
      ],
    ],
  },
  '3': {
    width: 0.58,
    strokes: [
      [
        ...ellipseArc(0.27, 0.25, 0.21, 0.25, 210, 450, true),
        ...ellipseArc(0.28, 0.75, 0.23, 0.25, 270, 515, false),
      ],
    ],
  },
  '4': {
    width: 0.6,
    strokes: [poly([0.42, 0], [0.06, 0.68], [0.54, 0.68]), line(0.42, 0, 0.42, 1)],
  },
  '5': {
    width: 0.58,
    strokes: [
      line(0.48, 0, 0.14, 0),
      [
        { type: 'M', x: 0.14, y: 0 },
        { type: 'L', x: 0.11, y: 0.44 },
        ...ellipseArc(0.29, 0.71, 0.22, 0.29, 230, 510, false),
      ],
    ],
  },
  '6': {
    width: 0.58,
    strokes: [
      [
        ...ellipseArc(0.32, 0.28, 0.22, 0.28, 325, 180, true),
        { type: 'L', x: 0.09, y: 0.72 },
        ...ellipseArc(0.3, 0.72, 0.21, 0.28, 180, 540, false),
      ],
    ],
  },
  '7': {
    width: 0.56,
    strokes: [poly([0.06, 0], [0.5, 0], [0.18, 1])],
  },
  '8': {
    width: 0.58,
    strokes: [
      ellipseArc(0.29, 0.24, 0.2, 0.24, 270, -90),
      ellipseArc(0.29, 0.74, 0.22, 0.26, 270, -90),
    ],
  },
  '9': {
    width: 0.58,
    strokes: [
      ellipseArc(0.28, 0.28, 0.21, 0.28, 330, -30),
      line(0.49, 0.26, 0.49, 1),
    ],
  },
  ' ': { width: 0.36, strokes: [] },
  '-': { width: 0.4, strokes: [line(0.06, 0.64, 0.34, 0.64)] },
  "'": { width: 0.24, strokes: [line(0.12, 0.04, 0.1, 0.26)] },
  '.': { width: 0.24, strokes: [line(0.12, 0.94, 0.12, 0.97)] },
  // Dotless i (Turkish ı)
  '\u0131': {
    width: 0.26,
    strokes: [line(0.13, MID, 0.13, 1)],
  },
};

function getCombiningMarkStrokes(
  mark: string,
  centerX: number,
  isUpper: boolean
): StrokeCmd[][] {
  const topY = isUpper ? -0.18 : 0.28;
  switch (mark) {
    case '\u0308': // umlaut ¨
      return [
        line(centerX - 0.09, topY, centerX - 0.09, topY + 0.03),
        line(centerX + 0.09, topY, centerX + 0.09, topY + 0.03),
      ];
    case '\u0301': // acute ´
      return [line(centerX + 0.07, topY - 0.04, centerX - 0.05, topY + 0.08)];
    case '\u0300': // grave `
      return [line(centerX - 0.07, topY - 0.04, centerX + 0.05, topY + 0.08)];
    case '\u0302': // circumflex ^
      return [poly([centerX - 0.1, topY + 0.06], [centerX, topY - 0.04], [centerX + 0.1, topY + 0.06])];
    case '\u0303': // tilde ~
      return [
        [
          { type: 'M', x: centerX - 0.11, y: topY + 0.04 },
          {
            type: 'C',
            x1: centerX - 0.04,
            y1: topY - 0.05,
            x2: centerX + 0.04,
            y2: topY + 0.09,
            x: centerX + 0.11,
            y: topY,
          },
        ],
      ];
    case '\u0306': // breve ˘ (Turkish ğ)
      return [ellipseArc(centerX, topY - 0.02, 0.11, 0.08, 175, 5)];
    case '\u0307': // dot above (Turkish İ)
      return [line(centerX, topY, centerX, topY + 0.03)];
    case '\u0327': // cedilla ¸ (ç, ş)
      return [
        [
          { type: 'M', x: centerX, y: 1.0 },
          ...ellipseArc(centerX + 0.02, 1.11, 0.08, 0.09, 270, 500, false),
        ],
      ];
    default:
      return [];
  }
}

interface ParsedChar {
  glyph: GlyphDef;
  isUpper: boolean;
  marks: string[];
}

function parseDisplayChars(text: string): ParsedChar[] {
  const result: ParsedChar[] = [];
  const normalized = text.normalize('NFD');

  for (const ch of normalized) {
    if (/[\u0300-\u036f]/.test(ch)) {
      if (result.length > 0) {
        result[result.length - 1].marks.push(ch);
      }
      continue;
    }

    const mapped =
      GLYPHS[ch] ||
      GLYPHS[ch === '’' || ch === '‘' ? "'" : ch] ||
      (ch === '–' || ch === '—' ? GLYPHS['-'] : undefined);

    if (mapped) {
      result.push({
        glyph: mapped,
        isUpper: ch >= 'A' && ch <= 'Z',
        marks: [],
      });
    } else if (/\s/.test(ch)) {
      result.push({ glyph: GLYPHS[' '], isUpper: false, marks: [] });
    }
  }

  return result;
}

function transformStroke(
  cmds: StrokeCmd[],
  originX: number,
  originY: number,
  scale: number
): StrokeCmd[] {
  return cmds.map((c) => {
    if (c.type === 'M' || c.type === 'L') {
      return {
        type: c.type,
        x: originX + c.x * scale,
        y: originY + c.y * scale,
      };
    }
    return {
      type: 'C',
      x1: originX + c.x1 * scale,
      y1: originY + c.y1 * scale,
      x2: originX + c.x2 * scale,
      y2: originY + c.y2 * scale,
      x: originX + c.x * scale,
      y: originY + c.y * scale,
    };
  });
}

export interface LayoutNameOptions {
  boxX: number;
  boxY: number;
  boxWidth: number;
  rowHeight: number;
  align?: 'left' | 'center';
}

export function layoutNameStrokes(
  text: string,
  options: LayoutNameOptions
): { strokes: StrokePath[]; totalWidth: number; scale: number } {
  const { boxX, boxY, boxWidth, rowHeight, align = 'left' } = options;
  const parsed = parseDisplayChars(text.trim() || 'Emma');
  if (parsed.length === 0) {
    return { strokes: [], totalWidth: 0, scale: rowHeight };
  }

  const gapUnit = 0.085;
  let units = 0;
  parsed.forEach((p, idx) => {
    units += p.glyph.width;
    if (idx < parsed.length - 1) units += gapUnit;
  });

  const maxScaleByHeight = rowHeight;
  const maxScaleByWidth = units > 0 ? boxWidth / units : rowHeight;
  const scale = Math.min(maxScaleByHeight, maxScaleByWidth);
  const totalWidth = units * scale;

  let cursorX =
    align === 'center' ? boxX + Math.max(0, (boxWidth - totalWidth) / 2) : boxX;

  const strokes: StrokePath[] = [];

  for (const item of parsed) {
    const { glyph, isUpper, marks } = item;

    glyph.strokes.forEach((rawStroke, sIdx) => {
      const transformed = transformStroke(rawStroke, cursorX, boxY, scale);
      const first = transformed[0];
      const startDot: [number, number] | undefined =
        sIdx === 0 && first && first.type === 'M'
          ? [first.x, first.y]
          : undefined;
      strokes.push({ commands: transformed, startDot });
    });

    for (const mark of marks) {
      const extraStrokes = getCombiningMarkStrokes(
        mark,
        glyph.width / 2,
        isUpper
      );
      for (const rawStroke of extraStrokes) {
        strokes.push({
          commands: transformStroke(rawStroke, cursorX, boxY, scale),
        });
      }
    }

    cursorX += (glyph.width + gapUnit) * scale;
  }

  return { strokes, totalWidth, scale };
}

export function strokeCommandsToSvgPath(commands: StrokeCmd[]): string {
  return commands
    .map((c) => {
      if (c.type === 'M') return `M ${c.x.toFixed(2)} ${c.y.toFixed(2)}`;
      if (c.type === 'L') return `L ${c.x.toFixed(2)} ${c.y.toFixed(2)}`;
      return `C ${c.x1.toFixed(2)} ${c.y1.toFixed(2)} ${c.x2.toFixed(2)} ${c.y2.toFixed(2)} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`;
    })
    .join(' ');
}
