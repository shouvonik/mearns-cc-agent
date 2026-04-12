/**
 * PlayHQ API client for Cricket Scotland / Mearns Cricket Club
 *
 * Docs: https://www.playhq.com/uk/cricket-scotland/register/e8f169
 * Tenant: cricket-scotland
 * Auth: x-api-key header
 */

const PLAYHQ_BASE = "https://api.playhq.com";
const TENANT = "cricket-scotland";

function playhqHeaders(): HeadersInit {
  return {
    "x-api-key": process.env.PLAYHQ_API_KEY!,
    "x-phq-tenant": TENANT,
    "Content-Type": "application/json",
  };
}

async function playhqFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${PLAYHQ_BASE}${path}`, {
    headers: playhqHeaders(),
    next: { revalidate: 300 }, // cache 5 minutes
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PlayHQ API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface PlayHQOrg {
  id: string;
  name: string;
}

export interface PlayHQGame {
  id: string;
  status: string; // "completed" | "upcoming" | "in_progress"
  round?: string | null;
  startTime: string; // ISO datetime
  homeTeam: {
    id: string;
    name: string;
    score?: string | null;
    wickets?: number | null;
    overs?: string | null;
  };
  awayTeam: {
    id: string;
    name: string;
    score?: string | null;
    wickets?: number | null;
    overs?: string | null;
  };
  venue?: {
    name: string;
    address?: string | null;
  } | null;
  grade?: {
    id: string;
    name: string;
  } | null;
  result?: string | null;
  resultDescription?: string | null;
}

export interface PlayHQBatterInning {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  dismissal?: string | null;
}

export interface PlayHQBowlerInning {
  name: string;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface PlayHQInning {
  battingTeam: string;
  totalRuns: number;
  totalWickets: number;
  totalOvers: string;
  batters: PlayHQBatterInning[];
  bowlers: PlayHQBowlerInning[];
  extras: number;
}

export interface PlayHQGameSummary {
  game: PlayHQGame;
  innings: PlayHQInning[];
}

export interface PlayHQLadderEntry {
  position: number;
  team: { id: string; name: string };
  played: number;
  won: number;
  lost: number;
  drawn: number;
  tied: number;
  noResult: number;
  points: number;
  netRunRate?: number | null;
}

// ── Organisation & Match Listing ───────────────────────────────────────────

/** Fetch games for a given organisation (club). paginated. */
export async function getOrgGames(
  orgId: string,
  params: { seasonId?: string; status?: string; page?: number } = {}
): Promise<{ games: PlayHQGame[]; pagination: { page: number; pageSize: number; total: number } }> {
  const qs = new URLSearchParams();
  if (params.seasonId) qs.set("seasonId", params.seasonId);
  if (params.status) qs.set("status", params.status);
  if (params.page) qs.set("page", String(params.page));
  const query = qs.toString() ? `?${qs}` : "";
  return playhqFetch(`/partner/v2/organisations/${orgId}/games${query}`);
}

/** Get the most recent completed games for Mearns CC */
export async function getRecentMearnsGames(): Promise<PlayHQGame[]> {
  const orgId = process.env.PLAYHQ_ORG_ID!;
  const data = await getOrgGames(orgId, { status: "completed" });
  return data.games;
}

// ── Game Detail ────────────────────────────────────────────────────────────

/** Get full scorecard/summary for a specific game */
export async function getGameSummary(gameId: string): Promise<PlayHQGameSummary> {
  return playhqFetch(`/v2/games/${gameId}/summary`);
}

/** Get games for a grade/competition */
export async function getGradeGames(
  gradeId: string,
  params: { status?: string; page?: number } = {}
): Promise<{ games: PlayHQGame[] }> {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.page) qs.set("page", String(params.page));
  const query = qs.toString() ? `?${qs}` : "";
  return playhqFetch(`/v2/grades/${gradeId}/games${query}`);
}

/** Get ladder/standings for a grade */
export async function getGradeLadder(gradeId: string): Promise<{ ladder: PlayHQLadderEntry[] }> {
  return playhqFetch(`/v1/grades/${gradeId}/ladder`);
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Determine whether Mearns CC won the game */
export function getMearnsResult(
  game: PlayHQGame,
  teamName = "Mearns Cricket Club"
): "won" | "lost" | "draw" | "no_result" | "unknown" {
  if (!game.resultDescription) return "unknown";
  const desc = game.resultDescription.toLowerCase();
  const team = teamName.toLowerCase();
  if (desc.includes(team) && (desc.includes("won") || desc.includes("win"))) return "won";
  if (desc.includes("no result")) return "no_result";
  if (desc.includes("draw") || desc.includes("tied")) return "draw";
  return "lost";
}

/** Format score string like "145/6 (32.4 ov)" */
export function formatScore(
  score?: string | null,
  wickets?: number | null,
  overs?: string | null
): string {
  if (!score) return "—";
  let out = score;
  if (wickets != null) out += `/${wickets}`;
  if (overs) out += ` (${overs} ov)`;
  return out;
}
