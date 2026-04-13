import { NextRequest, NextResponse } from "next/server";
import type { Player } from "@/lib/players";

/**
 * POST /api/team/suggest
 * Body: { availableIds: string[] }
 * Returns: { xi: Player[], captain: Player, wicketkeeper: Player }
 *
 * Algorithm:
 *   1. Score each player by role-weighted rating + team level bonus
 *   2. Greedily fill: 1 wk, ≥3 bowlers, ≥3 batters, rest best available
 */
export async function POST(req: NextRequest) {
  const { availableIds }: { availableIds: string[] } = await req.json();

  // Dynamic import so the large list is only loaded server-side
  const { PLAYERS } = await import("@/lib/players");

  const pool = PLAYERS.filter(
    (p) => availableIds.includes(p.id) && p.status === "Active"
  );

  if (pool.length < 11) {
    return NextResponse.json(
      { error: `Need at least 11 available players — only ${pool.length} provided` },
      { status: 400 }
    );
  }

  function score(p: Player): number {
    let bat = p.battingRating;
    let bowl = p.bowlingRating;
    let roleBonus = 0;
    if (p.role === "Batter") { bat *= 2; roleBonus = 1; }
    else if (p.role === "Bowler") { bowl *= 2; roleBonus = 1; }
    else { bat *= 1.5; bowl *= 1.5; roleBonus = 2; } // all-rounders are versatile
    // Lower teamLevel = higher ability; convert to bonus (max 4 levels → 0–3 bonus)
    const levelBonus = (5 - p.teamLevel) * 3;
    return bat + bowl + roleBonus + levelBonus;
  }

  const sorted = [...pool].sort((a, b) => score(b) - score(a));

  const xi: Player[] = [];
  const used = new Set<string>();

  function pick(p: Player) {
    xi.push(p);
    used.add(p.id);
  }

  // 1. Best wicketkeeper
  const wk = sorted.find((p) => p.isWicketkeeper);
  if (wk) pick(wk);

  // 2. At least 3 bowlers (role === "Bowler", not already picked)
  let bowlerCount = 0;
  for (const p of sorted) {
    if (bowlerCount >= 3) break;
    if (!used.has(p.id) && p.role === "Bowler") { pick(p); bowlerCount++; }
  }

  // 3. At least 3 batters (role === "Batter")
  let batterCount = 0;
  for (const p of sorted) {
    if (batterCount >= 3) break;
    if (!used.has(p.id) && p.role === "Batter") { pick(p); batterCount++; }
  }

  // 4. Fill remaining spots with best available (all-rounders preferred)
  for (const p of sorted) {
    if (xi.length >= 11) break;
    if (!used.has(p.id)) pick(p);
  }

  // Captain: prefer flagged captain, else highest scorer in XI
  const captain =
    xi.find((p) => p.isCaptain) ??
    [...xi].sort((a, b) => score(b) - score(a))[0];

  // Wicketkeeper in XI
  const wicketkeeper = xi.find((p) => p.isWicketkeeper) ?? xi[0];

  return NextResponse.json({ xi, captain, wicketkeeper });
}
