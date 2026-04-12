#!/usr/bin/env node
/**
 * Generates public/icons/icon-192.png and icon-512.png
 * Pure Node.js — no extra dependencies needed.
 * Green background (#16a34a) matching the app theme.
 */
import { writeFileSync, mkdirSync } from "fs";
import { deflateSync } from "zlib";

// ── CRC32 (required by PNG spec) ─────────────────────────────────────────────
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[i] = c;
}
function crc32(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

// ── PNG chunk builder ─────────────────────────────────────────────────────────
function chunk(type, data) {
  const typeBuf = Buffer.from(type);
  const dataBuf = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const lenBuf = Buffer.allocUnsafe(4);
  lenBuf.writeUInt32BE(dataBuf.length);
  const crcVal = Buffer.allocUnsafe(4);
  crcVal.writeUInt32BE(crc32(Buffer.concat([typeBuf, dataBuf])));
  return Buffer.concat([lenBuf, typeBuf, dataBuf, crcVal]);
}

// ── Solid-colour PNG ─────────────────────────────────────────────────────────
function makeSolidPNG(size, r, g, b) {
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB colour type
  ihdr[10] = ihdr[11] = ihdr[12] = 0;

  // Each scanline: 1 filter byte + 3 bytes per pixel
  const row = Buffer.allocUnsafe(1 + size * 3);
  row[0] = 0; // None filter
  for (let x = 0; x < size; x++) {
    row[1 + x * 3] = r;
    row[2 + x * 3] = g;
    row[3 + x * 3] = b;
  }
  const raw = Buffer.concat(Array.from({ length: size }, () => row));

  return Buffer.concat([
    PNG_SIG,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── Write icons ───────────────────────────────────────────────────────────────
mkdirSync("public/icons", { recursive: true });

// #16a34a → rgb(22, 163, 74)
const [R, G, B] = [22, 163, 74];

writeFileSync("public/icons/icon-192.png", makeSolidPNG(192, R, G, B));
console.log("✓ public/icons/icon-192.png");

writeFileSync("public/icons/icon-512.png", makeSolidPNG(512, R, G, B));
console.log("✓ public/icons/icon-512.png");
