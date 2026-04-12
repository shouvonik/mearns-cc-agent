# Mearns CC Agent

A mobile-first PWA for Mearns Cricket Club that pulls match data from PlayHQ, picks photos from Google Photos, generates AI-written summaries, and publishes them to Facebook, Instagram, and Twitter — all in a few taps.

---

## How it works

```
PlayHQ (match data)
      +
Google Photos (match photos)
      ↓
   [App]
      ↓
Claude AI → writes Facebook / Instagram / Twitter drafts
      ↓
 Review & edit → Preview exactly how each post looks
      ↓
 Publish to all 3 platforms at once
```

---

## Running locally (mock mode — no credentials needed)

### 1. First-time setup

```bash
cp .env.local.example .env.local   # leave all values blank
npm run generate-icons              # creates public/icons/icon-192.png + icon-512.png
```

### 2. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your Mac. The app runs entirely on mock data:

- **Matches** — 2025 pre-season friendlies + upcoming 2026 fixtures (East Kilbride, Ferguslie, West of Scotland, Milngavie)
- **Photos** — placeholder images; swap for real Google Photos when credentials are set
- **Summaries** — template-generated from the scorecard (no Claude API needed)
- **Publish** — preview mode shows styled mock-ups; actual posting is disabled until social credentials are configured

---

### Testing on your Android phone

The dev server is already bound to all network interfaces (`-H 0.0.0.0`), so you have two options:

#### Option A — localtunnel (over the internet, HTTPS)

In a **second terminal**, run this **after** the dev server is already showing `Ready`:

```bash
npx localtunnel --port 3000 --subdomain mearnscc
```

Open `https://mearnscc.loca.lt` on your Android.

> **Tunnel password prompt:** localtunnel may show a "Tunnel Password" page. Find your public IP by running `curl ifconfig.me` on your Mac, then enter it on the prompt page and click Continue.

> **Order matters:** always start `npm run dev` first. Starting the tunnel before the server causes a Bad Gateway error.

#### Option B — USB cable (no internet needed, most reliable)

1. Enable Developer Options on Android: Settings → About phone → tap **Build number** 7 times
2. Go to Developer options → turn on **USB debugging** → accept the prompt on your phone
3. Plug in the USB cable, then on your Mac:

```bash
brew install android-platform-tools
adb devices                    # confirms your phone is detected
adb reverse tcp:3000 tcp:3000  # forward phone's port → Mac
```

4. Open Chrome on Android and go to `http://localhost:3000`

`localhost` is always treated as secure — no warnings, full PWA install works.

#### Installing as a PWA

- **Android Chrome:** tap ⋮ menu → Add to Home screen
- The app icon appears on your home screen and opens without a browser bar

---

## 2026 Fixtures

| Date | Day | Competition | H/A | Opponent | Venue |
|---|---|---|---|---|---|
| 18 Apr 2026 | Saturday | Friendly (Prem 2) | Home | East Kilbride CC | Bellahouston Park |
| 19 Apr 2026 | Sunday | Friendly (Champ 2) | Away | Ferguslie CC | Ferguslie |
| 25 Apr 2026 | Saturday | Friendly (Champ 2) | Away | West of Scotland CC | Partick |
| 26 Apr 2026 | Sunday | Friendly (Prem 2) | Home | East Kilbride CC | New Williamfield 2 |
| 26 Apr 2026 | Sunday | Friendly (Champ 4) | Home | Milngavie CC | Bellahouston Park |

All fixtures are 50 overs, starting 12:00 PM, duration ~7 hours.

---

## 2025 Pre-Season Results

| Date | Opponent | H/A | Overs | Result |
|---|---|---|---|---|
| 12 Apr 2025 | St. Michaels CC | Away | 50 | Won by 14 runs |
| 19 Apr 2025 | Milngavie CC | Home (Bellahouston) | 50 | Won by 33 runs |
| 19 Apr 2025 | Bute CC | Away | 40 | Lost by 7 wkts |
| 20 Apr 2025 | Accies 2nd | Home (Bellahouston) | 40 | Won by 42 runs |
| 26 Apr 2025 | Ayr 2nd/3rd | Home (HPG) | 40 | Won by 4 runs |
| 27 Apr 2025 | Milngavie 2nd | Home (Bellahouston) | 40 | Won by 22 runs |
| 27 Apr 2025 | Stenhousemuir 2nd | Away | 40 | Won by 43 runs |

---

## Project structure

```
app/
  page.tsx                   # Home — match list with Upcoming / Results / Wins / Losses tabs
  matches/[id]/page.tsx      # 4-step flow: Scorecard → Photos → Summaries → Publish
  api/
    playhq/matches/           # GET  — list Mearns CC games
    playhq/match/[id]/        # GET  — full scorecard
    photos/                   # GET  — Google Photos album
    summary/                  # POST — generate AI summaries
    publish/facebook/         # POST — publish to Facebook Page
    publish/instagram/        # POST — publish to Instagram Business
    publish/twitter/          # POST — publish to Twitter/X

components/
  MatchCard.tsx               # Card on home screen (result badge, score, CTA)
  ScoreCard.tsx               # Full batting + bowling tables
  PhotoPicker.tsx             # Grid photo browser with multi-select
  SummaryEditor.tsx           # Per-platform text editor with char counter
  PostPreview.tsx             # Styled previews (Facebook / Instagram / Twitter)
  PublishPanel.tsx            # Toggle platforms, preview, publish

lib/
  playhq.ts                  # PlayHQ API client + types
  google-photos.ts           # Google Photos Library API client
  claude.ts                  # Claude AI summary generation
  template-summaries.ts      # Fallback summary generator (no API key needed)
  facebook.ts                # Facebook Graph API publisher
  instagram.ts               # Instagram Graph API publisher
  twitter.ts                 # Twitter API v2 publisher
  mock-data.ts               # Fixture data + photos for demo mode
```

---

## Connecting real credentials

Copy `.env.local.example` to `.env.local` and fill in one service at a time.
Each service is independent — the rest of the app stays in mock mode until that key is set.

### 1. PlayHQ (match data)

- Sign in at https://www.playhq.com/uk/cricket-scotland/register/e8f169
- Request API access via the Cricket Scotland admin or PlayHQ partner portal
- Set `PLAYHQ_API_KEY` and `PLAYHQ_ORG_ID` (Mearns CC's organisation ID)

### 2. Anthropic / Claude (AI summaries)

- Create an account at https://console.anthropic.com
- Generate an API key and set `ANTHROPIC_API_KEY`

### 3. Google Photos

- Go to https://console.cloud.google.com → create a project → enable **Photos Library API**
- Create OAuth 2.0 credentials, run the auth flow with scope `photoslibrary.readonly`
- Set `GOOGLE_PHOTOS_ACCESS_TOKEN` (short-lived; a proper refresh-token flow is needed for production)
- Set `GOOGLE_PHOTOS_ALBUM_ID` — find this in the album URL or via `GET /v1/albums`

### 4. Facebook & Instagram

- Go to https://developers.facebook.com → create an app → add **Pages API** product
- Generate a long-lived Page Access Token with `pages_manage_posts` permission
- Set `FACEBOOK_PAGE_ID` and `FACEBOOK_PAGE_ACCESS_TOKEN`
- For Instagram: link your Instagram Business account to the Facebook Page, then call
  `GET /{page-id}?fields=instagram_business_account` to get `INSTAGRAM_ACCOUNT_ID`

### 5. Twitter / X

- Go to https://developer.twitter.com → create a project & app
- Generate OAuth 1.0a keys (App Key, App Secret, Access Token, Access Secret)
- Set all four `TWITTER_*` environment variables

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, webpack mode) |
| Styling | Tailwind CSS v4 |
| PWA | next-pwa v5 |
| AI | Anthropic SDK — claude-opus-4-6 |
| Social | twitter-api-v2, Facebook/Instagram Graph API |
| Photos | Google Photos Library API (googleapis) |
| Language | TypeScript |
