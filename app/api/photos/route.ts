import { NextRequest, NextResponse } from "next/server";
import { listAlbumPhotos } from "@/lib/google-photos";
import { MOCK_PHOTOS } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  // Fall back to mock data when credentials are not configured
  if (!process.env.GOOGLE_PHOTOS_ACCESS_TOKEN) {
    return NextResponse.json({ photos: MOCK_PHOTOS, mock: true });
  }

  try {
    const { searchParams } = req.nextUrl;
    const pageToken = searchParams.get("pageToken") ?? undefined;
    const albumId = searchParams.get("albumId") ?? undefined;
    const pageSize = parseInt(searchParams.get("pageSize") ?? "30", 10);

    const result = await listAlbumPhotos(albumId, pageSize, pageToken);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
