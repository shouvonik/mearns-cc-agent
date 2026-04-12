/**
 * Claude AI summary generator
 *
 * Uses the Anthropic API to generate platform-specific match summaries
 * from raw PlayHQ scorecard data.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { PlayHQGameSummary } from "./playhq";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface MatchSummaries {
  facebook: string;
  instagram: string;
  twitter: string;
}

function buildScorecardText(summary: PlayHQGameSummary): string {
  const { game, innings } = summary;
  const lines: string[] = [];

  lines.push(`Match: ${game.homeTeam.name} vs ${game.awayTeam.name}`);
  if (game.grade) lines.push(`Competition: ${game.grade.name}`);
  if (game.venue) lines.push(`Venue: ${game.venue.name}`);
  lines.push(`Date: ${new Date(game.startTime).toLocaleDateString("en-GB")}`);
  if (game.resultDescription) lines.push(`Result: ${game.resultDescription}`);
  lines.push("");

  for (const inning of innings) {
    lines.push(`=== ${inning.battingTeam} innings: ${inning.totalRuns}/${inning.totalWickets} (${inning.totalOvers} ov) ===`);
    lines.push("Batting:");
    for (const b of inning.batters) {
      lines.push(
        `  ${b.name}: ${b.runs} (${b.balls}b, ${b.fours}x4, ${b.sixes}x6)${b.dismissal ? ` — ${b.dismissal}` : ""}`
      );
    }
    lines.push("Bowling:");
    for (const bwl of inning.bowlers) {
      lines.push(
        `  ${bwl.name}: ${bwl.wickets}/${bwl.runs} (${bwl.overs} ov, ${bwl.maidens} md)`
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

const SYSTEM_PROMPT = `You are a cricket club social media manager for Mearns Cricket Club,
a community cricket club in Scotland competing in Cricket Scotland competitions.
You write engaging, enthusiastic, and concise match reports for social media.
Tone: friendly, community-focused, celebrating effort and results.
Always mention key performers (top scorers and wicket-takers).
Use cricket terminology correctly.
Do NOT use markdown in outputs — plain text only.`;

/**
 * Generate match summaries for all three platforms from a PlayHQ game summary.
 */
export async function generateMatchSummaries(
  summary: PlayHQGameSummary,
  extraContext?: string
): Promise<MatchSummaries> {
  const scorecard = buildScorecardText(summary);

  const prompt = `Here is the scorecard from our recent match:

${scorecard}
${extraContext ? `\nAdditional context: ${extraContext}` : ""}

Please write three separate match summary posts:

1. FACEBOOK (250-400 words): Detailed, warm community post. Include scoreline, key performers, result context.
Can include a call to action ("Come support us next week!" style). End with relevant hashtags: #MearnsCC #CricketScotland

2. INSTAGRAM (150-200 words): Visual and punchy. Lead with the result/scoreline. Highlight 2-3 star performers.
Include line breaks for readability. End with hashtags: #MearnsCC #CricketScotland #Cricket #ScottishCricket

3. TWITTER (max 270 characters to leave room for image): Ultra-concise. Result + top performers.
Must fit in a single tweet. End with #MearnsCC

Format your response EXACTLY as:
---FACEBOOK---
[facebook post text]
---INSTAGRAM---
[instagram post text]
---TWITTER---
[twitter post text]`;

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
    system: SYSTEM_PROMPT,
  });

  const raw = message.content
    .filter((c) => c.type === "text")
    .map((c) => (c as { type: "text"; text: string }).text)
    .join("");

  return parseSummaries(raw);
}

function parseSummaries(raw: string): MatchSummaries {
  const facebookMatch = raw.match(/---FACEBOOK---\n([\s\S]*?)(?=---INSTAGRAM---|$)/);
  const instagramMatch = raw.match(/---INSTAGRAM---\n([\s\S]*?)(?=---TWITTER---|$)/);
  const twitterMatch = raw.match(/---TWITTER---\n([\s\S]*?)$/);

  return {
    facebook: facebookMatch?.[1]?.trim() ?? "",
    instagram: instagramMatch?.[1]?.trim() ?? "",
    twitter: twitterMatch?.[1]?.trim() ?? "",
  };
}
