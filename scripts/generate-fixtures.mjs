/**
 * Reads "2026 Matches Schedule.xlsx" and writes lib/fixtures-2026.ts
 * Run with: node scripts/generate-fixtures.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

const wb = XLSX.readFile("docs/2026 Matches Schedule.xlsx");
const ws = wb.Sheets["All Matches"];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

const MIDWEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const T20_COMPETITIONS = [
  "McCulloch Cup",
  "Western Cup",
  "Rowan Cup",
  "Greenwood Trophy",
  "Midweek Div 1",
  "Midweek Div 3",
];

const fixtures = [];

for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  const dateSerial = row[0];
  if (!dateSerial || typeof dateSerial !== "number") continue;

  const d = XLSX.SSF.parse_date_code(dateSerial);
  const dateStr = `${d.y}-${String(d.m).padStart(2, "0")}-${String(d.d).padStart(2, "0")}`;
  const day = row[1];
  const competition = row[2];
  const overs = row[3];
  const homeAway = row[4]; // "Home" or "Away"
  const opponent = row[5];
  const venue = row[6];
  const startTime = row[7]; // numeric hour
  const remarks = row[9] || "";

  if (!competition || !opponent) continue;

  const isWeekend = !MIDWEEK_DAYS.includes(day);
  const isT20 = overs === 20 || T20_COMPETITIONS.includes(competition);
  const isFriendly = competition.toLowerCase().startsWith("friendly");

  // Derive competition group for filtering
  let competitionGroup;
  if (isFriendly) competitionGroup = "Friendly";
  else if (competition === "Premiership 2") competitionGroup = "Premiership 2";
  else if (competition === "Championship 2") competitionGroup = "Championship 2";
  else if (competition === "Championship 4") competitionGroup = "Championship 4";
  else if (competition === "Sunday League Div 1") competitionGroup = "Sunday League";
  else if (competition === "CS Challenge Cup") competitionGroup = "CS Challenge Cup";
  else if (competition === "Midweek Div 1") competitionGroup = "Midweek Div 1";
  else if (competition === "Midweek Div 3") competitionGroup = "Midweek Div 3";
  else competitionGroup = "Cup"; // McCulloch, Western, Rowan, Greenwood

  fixtures.push({
    id: `fix-${dateStr}-${competition.replace(/\s+/g, "-").toLowerCase()}-${homeAway.toLowerCase()}`,
    date: dateStr,
    day,
    competition,
    competitionGroup,
    overs,
    homeAway,
    opponent: opponent.trim(),
    venue: venue.trim(),
    startTime: `${startTime}:00`,
    isWeekend,
    isT20,
    isFriendly,
    remarks: remarks.trim(),
    status: "upcoming",
  });
}

const ts = `// AUTO-GENERATED — run: node scripts/generate-fixtures.mjs
// Source: 2026 Matches Schedule.xlsx

export type CompetitionGroup =
  | "Friendly"
  | "Premiership 2"
  | "Championship 2"
  | "Championship 4"
  | "Sunday League"
  | "CS Challenge Cup"
  | "Midweek Div 1"
  | "Midweek Div 3"
  | "Cup";

export interface Fixture {
  id: string;
  date: string;         // YYYY-MM-DD
  day: string;          // Monday … Sunday
  competition: string;  // exact name from spreadsheet
  competitionGroup: CompetitionGroup;
  overs: number;
  homeAway: "Home" | "Away";
  opponent: string;
  venue: string;
  startTime: string;    // HH:mm
  isWeekend: boolean;
  isT20: boolean;
  isFriendly: boolean;
  remarks: string;
  status: "upcoming" | "completed";
}

export const FIXTURES_2026: Fixture[] = ${JSON.stringify(fixtures, null, 2)};

export const COMPETITION_GROUPS: CompetitionGroup[] = [
  "Premiership 2",
  "Championship 2",
  "Championship 4",
  "Sunday League",
  "CS Challenge Cup",
  "Midweek Div 1",
  "Midweek Div 3",
  "Cup",
  "Friendly",
];
`;

writeFileSync("lib/fixtures-2026.ts", ts);
console.log(`✓ lib/fixtures-2026.ts — ${fixtures.length} fixtures written`);
