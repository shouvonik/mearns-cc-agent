import { NextResponse } from "next/server";
import { getGameSummary } from "@/lib/playhq";
import { MOCK_GAME_SUMMARIES, MOCK_GAMES } from "@/lib/mock-data";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Fall back to mock data when credentials are not configured
  if (!process.env.PLAYHQ_API_KEY) {
    const mockSummary = MOCK_GAME_SUMMARIES[id];
    if (mockSummary) {
      return NextResponse.json({ ...mockSummary, mock: true });
    }
    // Return first mock if specific ID not found
    const firstKey = Object.keys(MOCK_GAME_SUMMARIES)[0];
    return NextResponse.json({ ...MOCK_GAME_SUMMARIES[firstKey], mock: true });
  }

  try {
    const summary = await getGameSummary(id);
    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
