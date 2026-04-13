/**
 * Reads "MCC-Players-For-AI.xlsx" and writes lib/players.ts
 * Run with: node scripts/generate-players.mjs
 *
 * The xlsx stores each row as a single CSV string in column A.
 * Columns: Player ID, Name, Preferred Name, Team Level, Role,
 *          Batting Rating, Bowling Rating, Wicketkeeper, Captain, Photo URL, Status
 */
import { writeFileSync } from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

const wb = XLSX.readFile("docs/MCC-Players-For-AI.xlsx");
const ws = wb.Sheets["Players"];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

const players = [];

for (let i = 1; i < rows.length; i++) {
  const raw = String(rows[i][0]).trim();
  if (!raw) continue;

  // Split on comma but only take first 11 fields (Photo URL may contain https://...)
  // Safe because no player name contains a comma in this dataset
  const parts = raw.split(",");
  if (parts.length < 11) continue;

  const id = parts[0].trim();
  const name = parts[1].trim();
  const preferredName = parts[2].trim();
  const teamLevel = parseInt(parts[3].trim(), 10);
  const role = parts[4].trim();
  const battingRating = parseInt(parts[5].trim(), 10);
  const bowlingRating = parseInt(parts[6].trim(), 10);
  const isWicketkeeper = parts[7].trim() === "Yes";
  const isCaptain = parts[8].trim() === "Yes";
  // Photo URL may contain commas if ever updated — rejoin everything between [9] and last-1
  const photoUrl = parts.slice(9, parts.length - 1).join(",").trim();
  const status = parts[parts.length - 1].trim();

  players.push({
    id,
    name,
    preferredName,
    teamLevel,
    role,
    battingRating,
    bowlingRating,
    isWicketkeeper,
    isCaptain,
    photoUrl,
    status,
  });
}

const ts = `// AUTO-GENERATED — run: node scripts/generate-players.mjs
// Source: MCC-Players-For-AI.xlsx

export type PlayerRole = "Batter" | "Bowler" | "All-rounder";
export type PlayerStatus = "Active" | "Inactive";

export interface Player {
  id: string;
  name: string;
  preferredName: string;
  /** 1 = highest ability, 4 = developmental */
  teamLevel: number;
  role: PlayerRole;
  /** 0–10 */
  battingRating: number;
  /** 0–10 */
  bowlingRating: number;
  isWicketkeeper: boolean;
  isCaptain: boolean;
  photoUrl: string;
  status: PlayerStatus;
}

export const PLAYERS: Player[] = ${JSON.stringify(players, null, 2)};
`;

writeFileSync("lib/players.ts", ts);
console.log(`✓ lib/players.ts — ${players.length} players written`);
