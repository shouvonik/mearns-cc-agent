/**
 * Twitter/X API v2 publisher
 *
 * Posts tweets with optional media to @MearnsCC (or configured account).
 * Requires: TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET
 *
 * Uses twitter-api-v2 package.
 * Docs: https://developer.twitter.com/en/docs/twitter-api
 */

import { TwitterApi } from "twitter-api-v2";

function getTwitterClient(): TwitterApi {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_SECRET!,
  });
  return client;
}

export interface TwitterPostResult {
  id: string;
  text: string;
  url: string;
}

/**
 * Post a text-only tweet.
 */
export async function postTweet(text: string): Promise<TwitterPostResult> {
  const client = getTwitterClient();
  const tweet = await client.v2.tweet(text);
  const tweetId = tweet.data.id;

  return {
    id: tweetId,
    text: tweet.data.text,
    url: `https://twitter.com/i/web/status/${tweetId}`,
  };
}

/**
 * Upload a media file (Buffer) to Twitter and return the media_id.
 */
async function uploadTwitterMedia(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  const client = getTwitterClient();
  // v1 media upload (v2 media upload not yet available)
  const mediaId = await client.v1.uploadMedia(buffer, { mimeType });
  return mediaId;
}

/**
 * Post a tweet with up to 4 images.
 */
export async function postTweetWithImages(
  text: string,
  images: Array<{ buffer: Buffer; mimeType: string }>
): Promise<TwitterPostResult> {
  if (images.length === 0) return postTweet(text);

  const client = getTwitterClient();
  const mediaIds = await Promise.all(
    images.slice(0, 4).map((img) => uploadTwitterMedia(img.buffer, img.mimeType))
  );

  // twitter-api-v2 requires a tuple of 1–4 media IDs
  const mediaIdTuple = mediaIds as
    | [string]
    | [string, string]
    | [string, string, string]
    | [string, string, string, string];

  const tweet = await client.v2.tweet({
    text,
    media: { media_ids: mediaIdTuple },
  });

  const tweetId = tweet.data.id;
  return {
    id: tweetId,
    text: tweet.data.text,
    url: `https://twitter.com/i/web/status/${tweetId}`,
  };
}

/**
 * Post a tweet with image URLs (downloads them first, then uploads to Twitter).
 */
export async function postTweetWithImageUrls(
  text: string,
  imageUrls: string[]
): Promise<TwitterPostResult> {
  if (imageUrls.length === 0) return postTweet(text);

  const images = await Promise.all(
    imageUrls.slice(0, 4).map(async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      const mimeType = res.headers.get("content-type") ?? "image/jpeg";
      return { buffer, mimeType };
    })
  );

  return postTweetWithImages(text, images);
}
