import { NextRequest, NextResponse } from "next/server";
import { postToFacebook, postWithPhotosToFacebook } from "@/lib/facebook";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, photoUrls } = body as {
      message: string;
      photoUrls?: string[];
    };

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    let result;
    if (photoUrls && photoUrls.length > 0) {
      result = await postWithPhotosToFacebook(
        message,
        photoUrls.map((url) => ({ url }))
      );
    } else {
      result = await postToFacebook(message);
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
