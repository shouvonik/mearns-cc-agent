import { NextRequest, NextResponse } from "next/server";
import { postToInstagram } from "@/lib/instagram";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { caption, imageUrls } = body as {
      caption: string;
      imageUrls: string[];
    };

    if (!caption) {
      return NextResponse.json({ error: "caption is required" }, { status: 400 });
    }
    if (!imageUrls || imageUrls.length === 0) {
      return NextResponse.json(
        { error: "Instagram requires at least one image URL" },
        { status: 400 }
      );
    }

    const result = await postToInstagram(caption, imageUrls);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
