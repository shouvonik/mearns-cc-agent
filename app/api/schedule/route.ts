import { NextResponse } from "next/server";
import { FIXTURES_2026 } from "@/lib/fixtures-2026";

export async function GET() {
  return NextResponse.json({ fixtures: FIXTURES_2026 });
}
