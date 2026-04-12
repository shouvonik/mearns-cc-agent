/**
 * Instagram Graph API publisher
 *
 * Posts to an Instagram Business account linked to a Facebook Page.
 * Requires: INSTAGRAM_ACCOUNT_ID, FACEBOOK_PAGE_ACCESS_TOKEN
 *
 * Flow: create media container → publish container
 * Docs: https://developers.facebook.com/docs/instagram-api/reference/ig-user/media
 */

const GRAPH_BASE = "https://graph.facebook.com/v20.0";

export interface InstagramPostResult {
  id: string;
  permalink?: string;
}

async function graphFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${GRAPH_BASE}${path}`, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Instagram Graph API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Publish a single-image post to Instagram.
 * imageUrl must be a publicly accessible HTTPS URL.
 */
export async function postSingleImageToInstagram(
  caption: string,
  imageUrl: string
): Promise<InstagramPostResult> {
  const igAccountId = process.env.INSTAGRAM_ACCOUNT_ID!;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!;

  // Step 1: Create media container
  const containerBody = new URLSearchParams({
    image_url: imageUrl,
    caption,
    access_token: token,
  });

  const container = await graphFetch<{ id: string }>(
    `/${igAccountId}/media`,
    { method: "POST", body: containerBody }
  );

  // Step 2: Publish the container
  const publishBody = new URLSearchParams({
    creation_id: container.id,
    access_token: token,
  });

  const published = await graphFetch<{ id: string }>(
    `/${igAccountId}/media_publish`,
    { method: "POST", body: publishBody }
  );

  return { id: published.id };
}

/**
 * Publish a carousel (multi-image) post to Instagram.
 * All imageUrls must be publicly accessible HTTPS URLs.
 */
export async function postCarouselToInstagram(
  caption: string,
  imageUrls: string[]
): Promise<InstagramPostResult> {
  const igAccountId = process.env.INSTAGRAM_ACCOUNT_ID!;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!;

  if (imageUrls.length === 0) {
    throw new Error("At least one image URL is required for an Instagram post");
  }

  if (imageUrls.length === 1) {
    return postSingleImageToInstagram(caption, imageUrls[0]);
  }

  // Step 1: Create child containers for each image
  const childIds = await Promise.all(
    imageUrls.map(async (url) => {
      const body = new URLSearchParams({
        image_url: url,
        is_carousel_item: "true",
        access_token: token,
      });
      const data = await graphFetch<{ id: string }>(`/${igAccountId}/media`, {
        method: "POST",
        body,
      });
      return data.id;
    })
  );

  // Step 2: Create carousel container
  const carouselBody = new URLSearchParams({
    media_type: "CAROUSEL",
    children: childIds.join(","),
    caption,
    access_token: token,
  });

  const carousel = await graphFetch<{ id: string }>(`/${igAccountId}/media`, {
    method: "POST",
    body: carouselBody,
  });

  // Step 3: Publish carousel
  const publishBody = new URLSearchParams({
    creation_id: carousel.id,
    access_token: token,
  });

  const published = await graphFetch<{ id: string }>(
    `/${igAccountId}/media_publish`,
    { method: "POST", body: publishBody }
  );

  return { id: published.id };
}

/**
 * Post text-only (no image) to Instagram.
 * NOTE: Instagram does not support purely text-only posts via API.
 * This helper posts with an optional fallback image or throws if none provided.
 */
export async function postToInstagram(
  caption: string,
  imageUrls: string[] = []
): Promise<InstagramPostResult> {
  if (imageUrls.length === 0) {
    throw new Error(
      "Instagram requires at least one image. Please select a match photo."
    );
  }
  return postCarouselToInstagram(caption, imageUrls);
}
