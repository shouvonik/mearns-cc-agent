import { NextResponse } from "next/server";
import { getRecentMearnsGames } from "@/lib/playhq";
import { MOCK_GAMES } from "@/lib/mock-data";

export async function GET() {
  // Fall back to mock data when credentials are not configured
  if (!process.env.PLAYHQ_API_KEY || !process.env.PLAYHQ_ORG_ID) {
    return NextResponse.json({ games: MOCK_GAMES, mock: true });
  }

  try {
    const games = await getRecentMearnsGames();
    return NextResponse.json({ games });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
