/**
 * Google Photos API client
 *
 * Uses OAuth2 service account or user OAuth to list photos from a designated album.
 * The album ID is stored in GOOGLE_PHOTOS_ALBUM_ID env var.
 *
 * Google Photos Library API docs:
 *   https://developers.google.com/photos/library/reference/rest
 */

import { google } from "googleapis";

const PHOTOS_BASE = "https://photoslibrary.googleapis.com/v1";

export interface GooglePhoto {
  id: string;
  filename: string;
  mimeType: string;
  baseUrl: string; // append =w2048-h1024 for sized download
  productUrl: string;
  mediaMetadata: {
    creationTime: string;
    width: string;
    height: string;
    photo?: {
      cameraMake?: string;
      cameraModel?: string;
    };
  };
}

export interface GooglePhotosAlbum {
  id: string;
  title: string;
  productUrl: string;
  coverPhotoBaseUrl: string;
  mediaItemsCount: string;
}

/**
 * Build an authenticated fetch function using OAuth2 tokens stored in env vars.
 * For production, wire up a proper OAuth2 refresh flow.
 */
async function photosAuthHeader(): Promise<{ Authorization: string }> {
  const accessToken = process.env.GOOGLE_PHOTOS_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("GOOGLE_PHOTOS_ACCESS_TOKEN env var is not set");
  }
  return { Authorization: `Bearer ${accessToken}` };
}

async function photosFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeader = await photosAuthHeader();
  const res = await fetch(`${PHOTOS_BASE}${path}`, {
    ...options,
    headers: {
      ...authHeader,
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Photos API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

/** List all albums accessible to the authenticated user */
export async function listAlbums(): Promise<GooglePhotosAlbum[]> {
  const data = await photosFetch<{ albums?: GooglePhotosAlbum[] }>("/albums");
  return data.albums ?? [];
}

/** List media items in the configured album (up to pageSize items) */
export async function listAlbumPhotos(
  albumId?: string,
  pageSize = 50,
  pageToken?: string
): Promise<{ photos: GooglePhoto[]; nextPageToken?: string }> {
  const targetAlbum = albumId ?? process.env.GOOGLE_PHOTOS_ALBUM_ID;
  if (!targetAlbum) {
    throw new Error("No album ID provided and GOOGLE_PHOTOS_ALBUM_ID is not set");
  }

  const body: Record<string, unknown> = {
    albumId: targetAlbum,
    pageSize,
  };
  if (pageToken) body.pageToken = pageToken;

  const data = await photosFetch<{
    mediaItems?: GooglePhoto[];
    nextPageToken?: string;
  }>("/mediaItems:search", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return {
    photos: data.mediaItems ?? [],
    nextPageToken: data.nextPageToken,
  };
}

/** Get a single media item by its ID */
export async function getPhoto(mediaItemId: string): Promise<GooglePhoto> {
  return photosFetch<GooglePhoto>(`/mediaItems/${mediaItemId}`);
}

/**
 * Build a download URL for a Google Photo at a specific size.
 * baseUrl must come from the API response — it expires after ~1 hour.
 * Non-Google URLs (e.g. mock/picsum URLs) are returned unchanged.
 */
export function buildPhotoUrl(
  baseUrl: string,
  width = 1080,
  height = 1080
): string {
  // Google Photos base URLs don't have a path suffix — append size param
  if (baseUrl.includes("lh3.googleusercontent.com")) {
    return `${baseUrl}=w${width}-h${height}`;
  }
  // Mock or external URLs — return as-is
  return baseUrl;
}

/**
 * Download a Google Photo as a Buffer (for uploading to social media APIs).
 */
export async function downloadPhoto(baseUrl: string): Promise<Buffer> {
  const url = buildPhotoUrl(baseUrl, 2048, 2048);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download photo: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
