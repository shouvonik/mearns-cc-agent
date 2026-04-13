/**
 * Converts a Fixture from the 2026 schedule into a PlayHQGame shape
 * so the existing MatchCard component can render it without changes.
 */
import type { PlayHQGame } from "./playhq";
import type { Fixture } from "./fixtures-2026";

export function fixtureToGame(f: Fixture): PlayHQGame {
  const isHome = f.homeAway === "Home";

  const mearnsTeam = {
    id: "mearns",
    name: "Mearns Cricket Club",
    score: null,
    wickets: null,
    overs: null,
  };

  const opponentTeam = {
    id: f.id,
    name: f.opponent,
    score: null,
    wickets: null,
    overs: null,
  };

  return {
    id: f.id,
    status: f.status,
    round: null,
    startTime: `${f.date}T${f.startTime}:00Z`,
    homeTeam: isHome ? mearnsTeam : opponentTeam,
    awayTeam: isHome ? opponentTeam : mearnsTeam,
    venue: { name: f.venue, address: null },
    grade: { id: f.competitionGroup, name: f.competition },
    result: null,
    resultDescription: f.remarks || null,
  };
}
