import { NextRequest, NextResponse } from "next/server";
import type { Player } from "@/lib/players";
import type { Fixture } from "@/lib/fixtures-2026";

export interface AnnouncePayload {
  xi: Player[];
  captainId: string;
  wicketkeeperId: string;
  fixture: Fixture | null;
}

export interface Announcements {
  caption: string;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmtDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00Z");
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

const OPENERS = [
  "Game day! 🏏",
  "It's match day!",
  "Up the Mearns!",
  "Let's go Mearns!",
  "Cricket time!",
  "We're ready!",
  "Here we go!",
  "Time to play some cricket!",
  "Match day vibes!",
  "The lads are ready!",
  "Mearns are in action!",
  "It's that time of the week!",
  "Another game, another chance to shine!",
  "The boys are out!",
  "Mearns on the field!",
  "Let's get it!",
  "Big game today!",
  "Ready for action!",
  "Mearns CC in action!",
  "The squad is set!",
  "It's a cricket kind of day!",
  "We love match day!",
  "Time to do what we do best!",
  "The team is named!",
  "Another day, another match!",
  "Bring it on!",
  "Eyes on the prize!",
  "Rolling out the XI!",
  "Here's the team!",
  "Cricket's back!",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST(req: NextRequest) {
  const { fixture }: AnnouncePayload = await req.json();

  let caption: string;
  if (fixture) {
    const date = fmtDate(fixture.date);
    caption =
      `${pick(OPENERS)} Mearns CC take on ${fixture.opponent} at ${fixture.venue} on ${date}` +
      ` (${fixture.competition}). #MearnsCC #CricketScotland`;
  } else {
    caption = `${pick(OPENERS)} Here's our Playing XI. #MearnsCC #CricketScotland`;
  }

  return NextResponse.json({ caption } satisfies Announcements);
}
