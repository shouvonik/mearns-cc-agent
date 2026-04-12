/**
 * Facebook Graph API publisher
 *
 * Posts text + optional photo to a Facebook Page.
 * Requires: FACEBOOK_PAGE_ID, FACEBOOK_PAGE_ACCESS_TOKEN
 *
 * Docs: https://developers.facebook.com/docs/graph-api/reference/page/feed/
 */

const GRAPH_BASE = "https://graph.facebook.com/v20.0";

export interface FacebookPostResult {
  id: string; // post id
  postUrl: string;
}

export interface FacebookPhotoResult {
  id: string;
  post_id: string;
}

async function graphFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${GRAPH_BASE}${path}`, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Facebook Graph API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Post text-only to the configured Facebook Page.
 */
export async function postToFacebook(message: string): Promise<FacebookPostResult> {
  const pageId = process.env.FACEBOOK_PAGE_ID!;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!;

  const body = new URLSearchParams({ message, access_token: token });

  const data = await graphFetch<{ id: string }>(`/${pageId}/feed`, {
    method: "POST",
    body,
  });

  return {
    id: data.id,
    postUrl: `https://www.facebook.com/${data.id.replace("_", "/posts/")}`,
  };
}

/**
 * Upload a photo to Facebook (from a URL or Buffer).
 * Returns the photo ID which can be attached to a post.
 */
async function uploadFacebookPhoto(
  source: { url: string } | { buffer: Buffer; mimeType: string }
): Promise<string> {
  const pageId = process.env.FACEBOOK_PAGE_ID!;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!;

  if ("url" in source) {
    const body = new URLSearchParams({
      url: source.url,
      published: "false",
      access_token: token,
    });
    const data = await graphFetch<{ id: string }>(`/${pageId}/photos`, {
      method: "POST",
      body,
    });
    return data.id;
  } else {
    // Binary upload via form-data
    const formData = new FormData();
    formData.append(
      "source",
      new Blob([source.buffer.buffer as ArrayBuffer], { type: source.mimeType }),
      "photo.jpg"
    );
    formData.append("published", "false");
    formData.append("access_token", token);

    const res = await fetch(`${GRAPH_BASE}/${pageId}/photos`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Facebook photo upload error ${res.status}: ${text}`);
    }
    const data = (await res.json()) as { id: string };
    return data.id;
  }
}

/**
 * Post text + one or more photos to the Facebook Page.
 * Photos can be provided as URLs or Buffers.
 */
export async function postWithPhotosToFacebook(
  message: string,
  photos: Array<{ url: string } | { buffer: Buffer; mimeType: string }>
): Promise<FacebookPostResult> {
  const pageId = process.env.FACEBOOK_PAGE_ID!;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!;

  if (photos.length === 0) {
    return postToFacebook(message);
  }

  // Upload all photos as unpublished
  const photoIds = await Promise.all(photos.map(uploadFacebookPhoto));

  // Create the post with attached photo IDs
  const body = new URLSearchParams({ message, access_token: token });
  photoIds.forEach((id, i) => {
    body.append(`attached_media[${i}]`, JSON.stringify({ media_fbid: id }));
  });

  const data = await graphFetch<{ id: string }>(`/${pageId}/feed`, {
    method: "POST",
    body,
  });

  return {
    id: data.id,
    postUrl: `https://www.facebook.com/${data.id.replace("_", "/posts/")}`,
  };
}
