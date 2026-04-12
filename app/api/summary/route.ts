import { NextRequest, NextResponse } from "next/server";
import { getGameSummary } from "@/lib/playhq";
import { generateMatchSummaries } from "@/lib/claude";
import { generateTemplateSummaries } from "@/lib/template-summaries";
import { MOCK_GAME_SUMMARIES } from "@/lib/mock-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gameId, extraContext } = body as {
      gameId: string;
      extraContext?: string;
    };

    if (!gameId) {
      return NextResponse.json({ error: "gameId is required" }, { status: 400 });
    }

    // Resolve the game summary (from mock or real API)
    let gameSummary;
    if (!process.env.PLAYHQ_API_KEY) {
      gameSummary =
        MOCK_GAME_SUMMARIES[gameId] ??
        MOCK_GAME_SUMMARIES[Object.keys(MOCK_GAME_SUMMARIES)[0]];
    } else {
      gameSummary = await getGameSummary(gameId);
    }

    // Generate summaries — use Claude if key is set, otherwise use templates
    const summaries = process.env.ANTHROPIC_API_KEY
      ? await generateMatchSummaries(gameSummary, extraContext)
      : generateTemplateSummaries(gameSummary);

    return NextResponse.json({
      summaries,
      mock: !process.env.ANTHROPIC_API_KEY,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
