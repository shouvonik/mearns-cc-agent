import { NextRequest, NextResponse } from "next/server";
import { postTweet, postTweetWithImageUrls } from "@/lib/twitter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, imageUrls } = body as {
      text: string;
      imageUrls?: string[];
    };

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }
    if (text.length > 280) {
      return NextResponse.json(
        { error: "Tweet exceeds 280 character limit" },
        { status: 400 }
      );
    }

    let result;
    if (imageUrls && imageUrls.length > 0) {
      result = await postTweetWithImageUrls(text, imageUrls);
    } else {
      result = await postTweet(text);
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
