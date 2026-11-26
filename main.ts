// Meme Sprint 3: AI Agent Goes Rogue — redo entry.
// "PLAN MY ANNIVERSARY DINNER" -> checklist: RESERVE A RESTAURANT (green
// check) / BUY THE RESTAURANT (huge manic red check), proud robot peeking
// over the card's corner. Node 22 stdlib only, deterministic, no network.
// Writes /output/entry.png (1024x1024 PNG).
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const W = 1024;
const H = 1024;
const px = new Uint8Array(W * H * 3);

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function fillRect(x: number, y: number, w: number, h: number, c: string): void {
  const [r, g, b] = rgb(c);
  const x0 = Math.max(0, x), y0 = Math.max(0, y);
  const x1 = Math.min(W, x + w), y1 = Math.min(H, y + h);
  for (let yy = y0; yy < y1; yy++) {
    for (let xx = x0; xx < x1; xx++) {
      const i = (yy * W + xx) * 3;
      px[i] = r; px[i + 1] = g; px[i + 2] = b;
    }
  }
}
function strokeRect(x: number, y: number, w: number, h: number, t: number, c: string): void {
  fillRect(x, y, w, t, c);
  fillRect(x, y + h - t, w, t, c);
  fillRect(x, y, t, h, c);
  fillRect(x + w - t, y, t, h, c);
}
function fillCircle(cx: number, cy: number, r: number, c: string): void {
  const [rr, gg, bb] = rgb(c);
  for (let y = cy - r; y <= cy + r; y++) {
    for (let x = cx - r; x <= cx + r; x++) {
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy <= r * r) {
        const i = (y * W + x) * 3;
        px[i] = rr; px[i + 1] = gg; px[i + 2] = bb;
      }
    }
  }
}
function drawLine(x0: number, y0: number, x1: number, y1: number, w: number, c: string): void {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let s = 0; s <= steps; s++) {
    const x = Math.round(x0 + ((x1 - x0) * s) / steps);
    const y = Math.round(y0 + ((y1 - y0) * s) / steps);
    fillCircle(x, y, Math.floor(w / 2), c);
  }
}

// 5x7 bitmap font, rows as 5-bit values (MSB = leftmost pixel).
const FONT: Record<string, number[]> = {
  A: [0x0e, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  B: [0x1e, 0x11, 0x11, 0x1e, 0x11, 0x11, 0x1e],
  C: [0x0e, 0x11, 0x10, 0x10, 0x10, 0x11, 0x0e],
  D: [0x1e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x1e],
  E: [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x1f],
  F: [0x1f, 0x10, 0x10, 0x1e, 0x10, 0x10, 0x10],
  G: [0x0e, 0x11, 0x10, 0x17, 0x11, 0x11, 0x0f],
  H: [0x11, 0x11, 0x11, 0x1f, 0x11, 0x11, 0x11],
  I: [0x0e, 0x04, 0x04, 0x04, 0x04, 0x04, 0x0e],
  J: [0x07, 0x02, 0x02, 0x02, 0x02, 0x12, 0x0c],
  K: [0x11, 0x12, 0x14, 0x18, 0x14, 0x12, 0x11],
  L: [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1f],
  M: [0x11, 0x1b, 0x15, 0x15, 0x11, 0x11, 0x11],
  N: [0x11, 0x19, 0x15, 0x13, 0x11, 0x11, 0x11],
  O: [0x0e, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  P: [0x1e, 0x11, 0x11, 0x1e, 0x10, 0x10, 0x10],
  Q: [0x0e, 0x11, 0x11, 0x11, 0x15, 0x12, 0x0d],
  R: [0x1e, 0x11, 0x11, 0x1e, 0x14, 0x12, 0x11],
  S: [0x0f, 0x10, 0x10, 0x0e, 0x01, 0x01, 0x1e],
  T: [0x1f, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04],
  U: [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0e],
  V: [0x11, 0x11, 0x11, 0x11, 0x11, 0x0a, 0x04],
  W: [0x11, 0x11, 0x11, 0x15, 0x15, 0x1b, 0x11],
  X: [0x11, 0x11, 0x0a, 0x04, 0x0a, 0x11, 0x11],
  Y: [0x11, 0x11, 0x0a, 0x04, 0x04, 0x04, 0x04],
  Z: [0x1f, 0x01, 0x02, 0x04, 0x08, 0x10, 0x1f],
  " ": [0, 0, 0, 0, 0, 0, 0],
};
function textWidth(s: string, scale: number): number {
  return s.length * 6 * scale - scale;
}
function drawText(s: string, x: number, y: number, scale: number, c: string): void {
  const [r, g, b] = rgb(c);
  for (let ci = 0; ci < s.length; ci++) {
    const glyph = FONT[s[ci]] ?? FONT[" "];
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if ((glyph[row] >> (4 - col)) & 1) {
          fillRect(x + (ci * 6 + col) * scale, y + row * scale, scale, scale, c);
        }
      }
    }
  }
  void r; void g; void b;
}
function drawTextCentered(s: string, cx: number, y: number, scale: number, c: string): void {
  drawText(s, cx - Math.floor(textWidth(s, scale) / 2), y, scale, c);
}

// ---- CRC32 + PNG encoder (filter 0, zlib level 9) ----
const CRC_TABLE: Uint32Array = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Buffer): Buffer {
  const out = Buffer.alloc(8 + data.length + 4);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, "ascii"), data])), 8 + data.length);
  return out;
}
function encodePNG(): Buffer {
  const raw = Buffer.alloc(H * (1 + W * 3));
  for (let y = 0; y < H; y++) {
    raw[y * (1 + W * 3)] = 0;
    raw.set(px.subarray(y * W * 3, (y + 1) * W * 3), y * (1 + W * 3) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type RGB
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---- Scene ----
const NAVY = "#10182B";
const INK = "#0E1524";
const CARD = "#F7F9FC";
const BUBBLE = "#EEF2F8";
const BORDER = "#2A3450";
const MUTED = "#7E8AA6";
const GREEN = "#22B573";
const RED = "#FF3B30";
const STEEL = "#C6D0E2";

fillRect(0, 0, W, H, NAVY);

// 1. Human's chat bubble: the request.
fillRect(64, 56, 896, 216, BUBBLE);
strokeRect(64, 56, 896, 216, 6, MUTED);
fillRect(104, 272, 40, 40, BUBBLE); // bubble tail
drawTextCentered("PLAN MY", 512, 96, 6, INK);
drawTextCentered("ANNIVERSARY DINNER", 512, 168, 6, INK);

// 2. Checklist card.
fillRect(64, 312, 896, 472, CARD);
strokeRect(64, 312, 896, 472, 8, BORDER);
fillRect(112, 540, 800, 5, "#D7DDE9"); // divider between rows

// Row 1: the sane task, neat green check.
fillRect(112, 384, 72, 72, "#FFFFFF");
strokeRect(112, 384, 72, 72, 6, BORDER);
drawLine(126, 424, 140, 440, 13, GREEN);
drawLine(140, 440, 172, 400, 13, GREEN);
drawText("RESERVE A RESTAURANT", 216, 402, 5, INK);

// Row 2: the rogue turn — huge manic red check bursting out of its box.
fillRect(112, 600, 72, 72, "#FFFFFF");
strokeRect(112, 600, 72, 72, 6, BORDER);
drawLine(96, 636, 140, 686, 18, RED);
drawLine(140, 686, 196, 592, 18, RED);
drawText("BUY THE RESTAURANT", 216, 618, 5, INK);

// 3. The agent: proud little robot head peeking over the card's corner.
fillRect(788, 648, 176, 176, STEEL);
strokeRect(788, 648, 176, 176, 6, BORDER);
fillRect(868, 606, 6, 42, BORDER); // antenna
fillCircle(871, 598, 12, GREEN); // antenna light: all good, boss!
fillCircle(836, 716, 13, NAVY); // eyes, glancing up-left at the red check
fillCircle(916, 716, 13, NAVY);
drawLine(836, 758, 856, 772, 8, NAVY); // smug smile, three strokes
drawLine(856, 772, 876, 772, 8, NAVY);
drawLine(876, 772, 896, 758, 8, NAVY);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.png", encodePNG());
