/**
 * Template-based match summary generator.
 * Used when ANTHROPIC_API_KEY is not set, so the app works in demo/mock mode.
 */

import type { PlayHQGameSummary, PlayHQInning, PlayHQBatterInning, PlayHQBowlerInning } from "./playhq";
import type { MatchSummaries } from "./claude";

function topBatters(inning: PlayHQInning, n = 2): PlayHQBatterInning[] {
  return [...inning.batters].sort((a, b) => b.runs - a.runs).slice(0, n);
}

function topBowlers(inning: PlayHQInning, n = 2): PlayHQBowlerInning[] {
  return [...inning.bowlers]
    .sort((a, b) => b.wickets - a.wickets || a.runs - b.runs)
    .slice(0, n);
}

function batterLine(b: PlayHQBatterInning): string {
  return `${b.name} (${b.runs}${b.sixes > 0 ? ` incl. ${b.sixes} six${b.sixes > 1 ? "es" : ""}` : ""})`;
}

function bowlerLine(b: PlayHQBowlerInning): string {
  return `${b.name} (${b.wickets}/${b.runs})`;
}

function resultPhrase(resultDesc: string | undefined | null, mearnsName: string): string {
  if (!resultDesc) return "concluded";
  return resultDesc;
}

export function generateTemplateSummaries(summary: PlayHQGameSummary): MatchSummaries {
  const { game, innings } = summary;
  const MEARNS = "Mearns Cricket Club";
  const resultDesc = game.resultDescription ?? "";
  const dateStr = new Date(game.startTime).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const competition = game.grade?.name ?? "Cricket Scotland";
  const venue = game.venue?.name ?? "home ground";

  const isMearnsHome = game.homeTeam.name.includes("Mearns");
  const mearnsTeam = isMearnsHome ? game.homeTeam : game.awayTeam;
  const opponent = isMearnsHome ? game.awayTeam : game.homeTeam;
  const mearnsScore = `${mearnsTeam.score ?? ""}/${mearnsTeam.wickets ?? ""}`;
  const opponentScore = `${opponent.score ?? ""}/${opponent.wickets ?? ""}`;

  // Find Mearns innings and opposition innings
  const mearnsInning = innings.find((i) => i.battingTeam.includes("Mearns"));
  const oppInning = innings.find((i) => !i.battingTeam.includes("Mearns"));

  const won = resultDesc.toLowerCase().includes("mearns") &&
    (resultDesc.toLowerCase().includes("won") || resultDesc.toLowerCase().includes("win"));
  const tied = resultDesc.toLowerCase().includes("tied") || resultDesc.toLowerCase().includes("tie");

  const resultEmoji = won ? "🏆" : tied ? "🤝" : "💪";
  const resultWord = won ? "victory" : tied ? "thrilling tie" : "defeat";

  // Key performers
  const mearnsTopBats = mearnsInning ? topBatters(mearnsInning) : [];
  const mearnsTopBowls = oppInning ? topBowlers(oppInning) : [];

  // ── FACEBOOK ──────────────────────────────────────────────────────────────
  const fbLines: string[] = [];
  fbLines.push(`${won ? "What a result!" : tied ? "What a thriller!" : "A tough day at the crease."} ${resultEmoji}`);
  fbLines.push("");
  fbLines.push(`${MEARNS} took on ${opponent.name} ${isMearnsHome ? "at home" : `at ${venue}`} on ${dateStr} in the ${competition}.`);
  fbLines.push("");

  if (mearnsInning) {
    fbLines.push(`Batting first, ${mearnsInning.battingTeam === MEARNS ? "we" : opponent.name} posted ${mearnsInning.totalRuns}/${mearnsInning.totalWickets} from ${mearnsInning.totalOvers} overs.`);
    if (mearnsTopBats.length > 0) {
      fbLines.push(`Standout contributions came from ${mearnsTopBats.map(batterLine).join(" and ")}.`);
    }
    if (mearnsTopBowls.length > 0) {
      fbLines.push(`In the field, ${mearnsTopBowls.map(bowlerLine).join(" and ")} led the bowling attack.`);
    }
  }

  fbLines.push("");
  fbLines.push(resultDesc || `Final result: ${MEARNS} ${mearnsScore} vs ${opponent.name} ${opponentScore}.`);
  fbLines.push("");
  fbLines.push(
    won
      ? "Brilliant team effort — the lads should be very proud. On to the next one! 🙌"
      : tied
      ? "An incredible match that had everything — what drama right until the final ball! 🏏"
      : "Tough result, but the character shown was immense. We'll be back stronger next week. 💪"
  );
  fbLines.push("");
  fbLines.push("#MearnsCC #CricketScotland #Cricket #ScottishCricket");

  // ── INSTAGRAM ─────────────────────────────────────────────────────────────
  const igLines: string[] = [];
  igLines.push(resultDesc ? resultDesc.toUpperCase() + " " + resultEmoji : `MATCH REPORT ${resultEmoji}`);
  igLines.push("");
  igLines.push(`${MEARNS} ${mearnsScore} vs ${opponent.name} ${opponentScore}`);
  igLines.push(competition);
  igLines.push("");
  if (mearnsTopBats.length > 0) {
    igLines.push(`With the bat: ${mearnsTopBats.map(batterLine).join(", ")}`);
  }
  if (mearnsTopBowls.length > 0) {
    igLines.push(`With the ball: ${mearnsTopBowls.map(bowlerLine).join(", ")}`);
  }
  igLines.push("");
  igLines.push(
    won ? "Great win, team! 🏆" : tied ? "What a match! 🤝" : "We'll bounce back. 💪"
  );
  igLines.push("");
  igLines.push("#MearnsCC #CricketScotland #Cricket #ScottishCricket #CommunityClub");

  // ── TWITTER ───────────────────────────────────────────────────────────────
  let tweet = "";
  const batStar = mearnsTopBats[0];
  const bowlStar = mearnsTopBowls[0];

  if (batStar && bowlStar) {
    tweet = `${resultDesc || "Full time"}. ${batStar.name} ${batStar.runs} & ${bowlStar.name} ${bowlStar.wickets}/${bowlStar.runs} the stars. #MearnsCC`;
  } else if (batStar) {
    tweet = `${resultDesc || "Full time"}. ${batStar.name} ${batStar.runs} leads the way. #MearnsCC`;
  } else {
    tweet = `${resultDesc || `${MEARNS} ${mearnsScore} vs ${opponent.name} ${opponentScore}`}. #MearnsCC`;
  }

  // Ensure tweet fits in 280 chars
  if (tweet.length > 280) {
    tweet = tweet.slice(0, 276) + "…";
  }

  return {
    facebook: fbLines.join("\n"),
    instagram: igLines.join("\n"),
    twitter: tweet,
  };
}
