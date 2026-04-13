import { NextResponse } from "next/server";
import { getRecentMearnsGames } from "@/lib/playhq";
import { MOCK_GAMES } from "@/lib/mock-data";
import { FIXTURES_2026 } from "@/lib/fixtures-2026";
import { fixtureToGame } from "@/lib/fixture-adapter";

// Convert all upcoming fixtures from the 2026 schedule into PlayHQGame objects
const upcomingFromSchedule = FIXTURES_2026
  .filter((f) => f.status === "upcoming")
  .map(fixtureToGame);

export async function GET() {
  // Fall back to mock completed results when PlayHQ credentials are not configured
  const completedGames = (!process.env.PLAYHQ_API_KEY || !process.env.PLAYHQ_ORG_ID)
    ? MOCK_GAMES.filter((g) => g.status === "completed")
    : await getRecentMearnsGames().catch(() => []);

  // Always merge with the real upcoming schedule
  const games = [...upcomingFromSchedule, ...completedGames];

  return NextResponse.json({
    games,
    mock: !process.env.PLAYHQ_API_KEY,
  });
}
