/**
 * Mock data for development / demo mode.
 * Used automatically when API credentials are not configured.
 */

import type { PlayHQGame, PlayHQGameSummary } from "./playhq";
import type { GooglePhoto } from "./google-photos";

// ── Mock Matches ───────────────────────────────────────────────────────────

export const MOCK_GAMES: PlayHQGame[] = [
  {
    id: "mock-game-1",
    status: "completed",
    round: "Round 8",
    startTime: "2026-04-05T10:30:00Z",
    homeTeam: {
      id: "mearns",
      name: "Mearns Cricket Club",
      score: "187",
      wickets: 6,
      overs: "40",
    },
    awayTeam: {
      id: "stoneywood",
      name: "Stoneywood-Dyce CC",
      score: "142",
      wickets: 10,
      overs: "36.2",
    },
    venue: { name: "Mearns Castle Sports Ground", address: "Newton Mearns, Glasgow" },
    grade: { id: "grade-wdu", name: "Cricket Scotland West District Union - Div 1" },
    result: "home_win",
    resultDescription: "Mearns Cricket Club won by 45 runs",
  },
  {
    id: "mock-game-2",
    status: "completed",
    round: "Round 7",
    startTime: "2026-03-29T10:30:00Z",
    homeTeam: {
      id: "grange",
      name: "Grange CC",
      score: "221",
      wickets: 5,
      overs: "40",
    },
    awayTeam: {
      id: "mearns",
      name: "Mearns Cricket Club",
      score: "178",
      wickets: 10,
      overs: "37.4",
    },
    venue: { name: "Raeburn Place", address: "Edinburgh" },
    grade: { id: "grade-wdu", name: "Cricket Scotland West District Union - Div 1" },
    result: "away_loss",
    resultDescription: "Grange CC won by 43 runs",
  },
  {
    id: "mock-game-3",
    status: "completed",
    round: "Round 6",
    startTime: "2026-03-22T10:30:00Z",
    homeTeam: {
      id: "uddingston",
      name: "Uddingston CC",
      score: "163",
      wickets: 9,
      overs: "40",
    },
    awayTeam: {
      id: "mearns",
      name: "Mearns Cricket Club",
      score: "164",
      wickets: 4,
      overs: "33.1",
    },
    venue: { name: "Bothwell Castle Policies", address: "Uddingston" },
    grade: { id: "grade-wdu", name: "Cricket Scotland West District Union - Div 1" },
    result: "away_win",
    resultDescription: "Mearns Cricket Club won by 6 wickets",
  },
  {
    id: "mock-game-4",
    status: "completed",
    round: "Round 5",
    startTime: "2026-03-15T10:30:00Z",
    homeTeam: {
      id: "mearns",
      name: "Mearns Cricket Club",
      score: "102",
      wickets: 10,
      overs: "28.3",
    },
    awayTeam: {
      id: "kelburne",
      name: "Kelburne CC",
      score: "103",
      wickets: 3,
      overs: "22.0",
    },
    venue: { name: "Mearns Castle Sports Ground", address: "Newton Mearns, Glasgow" },
    grade: { id: "grade-wdu", name: "Cricket Scotland West District Union - Div 1" },
    result: "home_loss",
    resultDescription: "Kelburne CC won by 7 wickets",
  },
  {
    id: "mock-game-5",
    status: "completed",
    round: "Round 4",
    startTime: "2026-03-08T10:30:00Z",
    homeTeam: {
      id: "mearns",
      name: "Mearns Cricket Club",
      score: "198",
      wickets: 7,
      overs: "40",
    },
    awayTeam: {
      id: "ayr",
      name: "Ayr CC",
      score: "198",
      wickets: 7,
      overs: "40",
    },
    venue: { name: "Mearns Castle Sports Ground", address: "Newton Mearns, Glasgow" },
    grade: { id: "grade-wdu", name: "Cricket Scotland West District Union - Div 1" },
    result: "tie",
    resultDescription: "Match tied — 198/7 each",
  },

  // ── 2025 Pre-Season Friendlies ───────────────────────────────────────────
  {
    id: "ps-2025-1",
    status: "completed",
    round: null,
    startTime: "2025-04-12T12:00:00Z",
    homeTeam: { id: "st-michaels", name: "St. Michaels CC" },
    awayTeam: { id: "mearns", name: "Mearns Cricket Club", score: "156", wickets: 6, overs: "50" },
    venue: { name: "St. Michaels CC Ground", address: "Scotland" },
    grade: { id: "pre-season", name: "Pre-Season Friendly — 50 overs" },
    result: "away_win",
    resultDescription: "Mearns Cricket Club won by 14 runs",
  },
  {
    id: "ps-2025-2",
    status: "completed",
    round: null,
    startTime: "2025-04-19T12:00:00Z",
    homeTeam: { id: "mearns", name: "Mearns Cricket Club", score: "178", wickets: 5, overs: "50" },
    awayTeam: { id: "milngavie", name: "Milngavie CC", score: "145", wickets: 9, overs: "50" },
    venue: { name: "Bellahouston Park", address: "Glasgow" },
    grade: { id: "pre-season", name: "Pre-Season Friendly — 50 overs" },
    result: "home_win",
    resultDescription: "Mearns Cricket Club won by 33 runs",
  },
  {
    id: "ps-2025-3",
    status: "completed",
    round: null,
    startTime: "2025-04-19T12:00:00Z",
    homeTeam: { id: "bute-cc", name: "Bute CC" },
    awayTeam: { id: "mearns", name: "Mearns Cricket Club", score: "121", wickets: 10, overs: "38.2" },
    venue: { name: "Bute CC Ground", address: "Isle of Bute" },
    grade: { id: "pre-season", name: "Pre-Season Friendly — 40 overs" },
    result: "away_loss",
    resultDescription: "Bute CC won by 7 wickets",
  },
  {
    id: "ps-2025-4",
    status: "completed",
    round: null,
    startTime: "2025-04-20T12:00:00Z",
    homeTeam: { id: "mearns", name: "Mearns Cricket Club", score: "165", wickets: 4, overs: "40" },
    awayTeam: { id: "accies-2nd", name: "Accies 2nd", score: "123", wickets: 10, overs: "35.1" },
    venue: { name: "Bellahouston Park", address: "Glasgow" },
    grade: { id: "pre-season", name: "Pre-Season Friendly — 40 overs" },
    result: "home_win",
    resultDescription: "Mearns Cricket Club won by 42 runs",
  },
  {
    id: "ps-2025-5",
    status: "completed",
    round: null,
    startTime: "2025-04-26T12:00:00Z",
    homeTeam: { id: "mearns", name: "Mearns Cricket Club", score: "147", wickets: 8, overs: "40" },
    awayTeam: { id: "ayr-2", name: "Ayr 2nd/3rd", score: "143", wickets: 10, overs: "39.4" },
    venue: { name: "HPG, Glasgow", address: "Glasgow" },
    grade: { id: "pre-season", name: "Pre-Season Friendly — 40 overs" },
    result: "home_win",
    resultDescription: "Mearns Cricket Club won by 4 runs",
  },
  {
    id: "ps-2025-6",
    status: "completed",
    round: null,
    startTime: "2025-04-27T12:00:00Z",
    homeTeam: { id: "mearns", name: "Mearns Cricket Club", score: "189", wickets: 5, overs: "40" },
    awayTeam: { id: "milngavie-2", name: "Milngavie 2nd", score: "167", wickets: 8, overs: "40" },
    venue: { name: "Bellahouston Park", address: "Glasgow" },
    grade: { id: "pre-season", name: "Pre-Season Friendly — 40 overs" },
    result: "home_win",
    resultDescription: "Mearns Cricket Club won by 22 runs",
  },
  {
    id: "ps-2025-7",
    status: "completed",
    round: null,
    startTime: "2025-04-27T12:00:00Z",
    homeTeam: { id: "stenhousemuir-2", name: "Stenhousemuir 2nd" },
    awayTeam: { id: "mearns", name: "Mearns Cricket Club", score: "198", wickets: 7, overs: "40" },
    venue: { name: "Stenhousemuir CC Ground", address: "Stenhousemuir, Falkirk" },
    grade: { id: "pre-season", name: "Pre-Season Friendly — 40 overs" },
    result: "away_win",
    resultDescription: "Mearns Cricket Club won by 43 runs",
  },
];

export const MOCK_GAME_SUMMARIES: Record<string, PlayHQGameSummary> = {
  "mock-game-1": {
    game: MOCK_GAMES[0],
    innings: [
      {
        battingTeam: "Mearns Cricket Club",
        totalRuns: 187,
        totalWickets: 6,
        totalOvers: "40",
        extras: 12,
        batters: [
          { name: "Callum Morrison", runs: 72, balls: 89, fours: 8, sixes: 2, strikeRate: 80.9, dismissal: "c Patel b Sharma" },
          { name: "David Reid", runs: 45, balls: 52, fours: 5, sixes: 1, strikeRate: 86.5, dismissal: "b Gupta" },
          { name: "Liam Henderson", runs: 31, balls: 38, fours: 3, sixes: 0, strikeRate: 81.6, dismissal: "lbw b Sharma" },
          { name: "Ross Campbell", runs: 18, balls: 22, fours: 2, sixes: 0, strikeRate: 81.8, dismissal: "run out" },
          { name: "Jamie Thomson", runs: 14, balls: 16, fours: 1, sixes: 1, strikeRate: 87.5, dismissal: null },
          { name: "Stuart McGill", runs: 7, balls: 10, fours: 0, sixes: 0, strikeRate: 70.0, dismissal: null },
        ],
        bowlers: [
          { name: "R. Sharma", overs: "8", maidens: 1, runs: 38, wickets: 2, economy: 4.75 },
          { name: "A. Gupta", overs: "8", maidens: 0, runs: 42, wickets: 1, economy: 5.25 },
          { name: "P. Patel", overs: "8", maidens: 1, runs: 35, wickets: 1, economy: 4.38 },
          { name: "K. Singh", overs: "8", maidens: 0, runs: 40, wickets: 1, economy: 5.0 },
          { name: "V. Kumar", overs: "8", maidens: 0, runs: 32, wickets: 1, economy: 4.0 },
        ],
      },
      {
        battingTeam: "Stoneywood-Dyce CC",
        totalRuns: 142,
        totalWickets: 10,
        totalOvers: "36.2",
        extras: 8,
        batters: [
          { name: "Raj Patel", runs: 48, balls: 62, fours: 5, sixes: 0, strikeRate: 77.4, dismissal: "c Morrison b Henderson" },
          { name: "Arjun Sharma", runs: 31, balls: 40, fours: 3, sixes: 1, strikeRate: 77.5, dismissal: "b Thomson" },
          { name: "Vishal Kumar", runs: 22, balls: 28, fours: 2, sixes: 0, strikeRate: 78.6, dismissal: "c Reid b McGill" },
          { name: "Priya Singh", runs: 14, balls: 19, fours: 1, sixes: 0, strikeRate: 73.7, dismissal: "lbw b Henderson" },
          { name: "Dev Gupta", runs: 11, balls: 15, fours: 1, sixes: 0, strikeRate: 73.3, dismissal: "b Thomson" },
          { name: "Neel Mehta", runs: 8, balls: 12, fours: 0, sixes: 1, strikeRate: 66.7, dismissal: "b Campbell" },
        ],
        bowlers: [
          { name: "Liam Henderson", overs: "8", maidens: 2, runs: 22, wickets: 3, economy: 2.75 },
          { name: "Jamie Thomson", overs: "7.2", maidens: 1, runs: 28, wickets: 3, economy: 3.82 },
          { name: "Ross Campbell", overs: "7", maidens: 0, runs: 31, wickets: 1, economy: 4.43 },
          { name: "Stuart McGill", overs: "8", maidens: 0, runs: 35, wickets: 2, economy: 4.38 },
          { name: "Callum Morrison", overs: "6", maidens: 0, runs: 26, wickets: 1, economy: 4.33 },
        ],
      },
    ],
  },
  "mock-game-2": {
    game: MOCK_GAMES[1],
    innings: [
      {
        battingTeam: "Grange CC",
        totalRuns: 221,
        totalWickets: 5,
        totalOvers: "40",
        extras: 11,
        batters: [
          { name: "Tom Watson", runs: 89, balls: 101, fours: 10, sixes: 3, strikeRate: 88.1, dismissal: "c Morrison b Henderson" },
          { name: "Ian Douglas", runs: 54, balls: 68, fours: 6, sixes: 1, strikeRate: 79.4, dismissal: "b Thomson" },
          { name: "Alistair Grant", runs: 38, balls: 44, fours: 4, sixes: 0, strikeRate: 86.4, dismissal: "lbw b Reid" },
          { name: "Ben Fraser", runs: 22, balls: 26, fours: 2, sixes: 0, strikeRate: 84.6, dismissal: null },
          { name: "Colin Muir", runs: 18, balls: 21, fours: 1, sixes: 1, strikeRate: 85.7, dismissal: null },
        ],
        bowlers: [
          { name: "Liam Henderson", overs: "8", maidens: 1, runs: 41, wickets: 2, economy: 5.13 },
          { name: "Jamie Thomson", overs: "8", maidens: 0, runs: 48, wickets: 1, economy: 6.0 },
          { name: "David Reid", overs: "8", maidens: 0, runs: 44, wickets: 1, economy: 5.5 },
          { name: "Ross Campbell", overs: "8", maidens: 0, runs: 52, wickets: 0, economy: 6.5 },
          { name: "Stuart McGill", overs: "8", maidens: 0, runs: 36, wickets: 1, economy: 4.5 },
        ],
      },
      {
        battingTeam: "Mearns Cricket Club",
        totalRuns: 178,
        totalWickets: 10,
        totalOvers: "37.4",
        extras: 9,
        batters: [
          { name: "Callum Morrison", runs: 61, balls: 78, fours: 7, sixes: 1, strikeRate: 78.2, dismissal: "c Watson b Douglas" },
          { name: "David Reid", runs: 39, balls: 51, fours: 4, sixes: 0, strikeRate: 76.5, dismissal: "b Grant" },
          { name: "Liam Henderson", runs: 28, balls: 35, fours: 3, sixes: 0, strikeRate: 80.0, dismissal: "c Fraser b Muir" },
          { name: "Ross Campbell", runs: 19, balls: 24, fours: 2, sixes: 0, strikeRate: 79.2, dismissal: "lbw b Grant" },
          { name: "Jamie Thomson", runs: 14, balls: 18, fours: 1, sixes: 0, strikeRate: 77.8, dismissal: "b Watson" },
          { name: "Stuart McGill", runs: 8, balls: 11, fours: 0, sixes: 0, strikeRate: 72.7, dismissal: "b Douglas" },
        ],
        bowlers: [
          { name: "Tom Watson", overs: "8", maidens: 1, runs: 34, wickets: 2, economy: 4.25 },
          { name: "Ian Douglas", overs: "8", maidens: 0, runs: 38, wickets: 2, economy: 4.75 },
          { name: "Alistair Grant", overs: "8", maidens: 1, runs: 30, wickets: 2, economy: 3.75 },
          { name: "Colin Muir", overs: "7.4", maidens: 0, runs: 42, wickets: 1, economy: 5.48 },
          { name: "Ben Fraser", overs: "6", maidens: 0, runs: 34, wickets: 1, economy: 5.67 },
        ],
      },
    ],
  },
  "mock-game-3": {
    game: MOCK_GAMES[2],
    innings: [
      {
        battingTeam: "Uddingston CC",
        totalRuns: 163,
        totalWickets: 9,
        totalOvers: "40",
        extras: 14,
        batters: [
          { name: "Alan Paterson", runs: 55, balls: 71, fours: 6, sixes: 1, strikeRate: 77.5, dismissal: "c Reid b Henderson" },
          { name: "Scott Brown", runs: 38, balls: 50, fours: 4, sixes: 0, strikeRate: 76.0, dismissal: "b Thomson" },
          { name: "Craig White", runs: 27, balls: 36, fours: 3, sixes: 0, strikeRate: 75.0, dismissal: "lbw b Campbell" },
          { name: "James Black", runs: 18, balls: 23, fours: 1, sixes: 1, strikeRate: 78.3, dismissal: "c Morrison b McGill" },
          { name: "Derek King", runs: 11, balls: 14, fours: 1, sixes: 0, strikeRate: 78.6, dismissal: "b Henderson" },
        ],
        bowlers: [
          { name: "Liam Henderson", overs: "8", maidens: 2, runs: 24, wickets: 3, economy: 3.0 },
          { name: "Jamie Thomson", overs: "8", maidens: 1, runs: 31, wickets: 2, economy: 3.88 },
          { name: "Ross Campbell", overs: "8", maidens: 0, runs: 38, wickets: 1, economy: 4.75 },
          { name: "Stuart McGill", overs: "8", maidens: 0, runs: 35, wickets: 2, economy: 4.38 },
          { name: "Callum Morrison", overs: "8", maidens: 0, runs: 35, wickets: 1, economy: 4.38 },
        ],
      },
      {
        battingTeam: "Mearns Cricket Club",
        totalRuns: 164,
        totalWickets: 4,
        totalOvers: "33.1",
        extras: 7,
        batters: [
          { name: "Callum Morrison", runs: 68, balls: 79, fours: 8, sixes: 2, strikeRate: 86.1, dismissal: "c Brown b Paterson" },
          { name: "David Reid", runs: 52, balls: 64, fours: 6, sixes: 0, strikeRate: 81.3, dismissal: "b White" },
          { name: "Liam Henderson", runs: 24, balls: 29, fours: 2, sixes: 1, strikeRate: 82.8, dismissal: null },
          { name: "Ross Campbell", runs: 13, balls: 16, fours: 1, sixes: 0, strikeRate: 81.3, dismissal: null },
        ],
        bowlers: [
          { name: "Alan Paterson", overs: "7", maidens: 1, runs: 38, wickets: 1, economy: 5.43 },
          { name: "Scott Brown", overs: "7", maidens: 0, runs: 36, wickets: 1, economy: 5.14 },
          { name: "Craig White", overs: "7.1", maidens: 0, runs: 40, wickets: 1, economy: 5.58 },
          { name: "James Black", overs: "6", maidens: 0, runs: 30, wickets: 0, economy: 5.0 },
          { name: "Derek King", overs: "6", maidens: 0, runs: 20, wickets: 1, economy: 3.33 },
        ],
      },
    ],
  },
  "mock-game-4": {
    game: MOCK_GAMES[3],
    innings: [
      {
        battingTeam: "Mearns Cricket Club",
        totalRuns: 102,
        totalWickets: 10,
        totalOvers: "28.3",
        extras: 6,
        batters: [
          { name: "Callum Morrison", runs: 34, balls: 48, fours: 4, sixes: 0, strikeRate: 70.8, dismissal: "b Ahmed" },
          { name: "David Reid", runs: 22, balls: 31, fours: 2, sixes: 0, strikeRate: 71.0, dismissal: "c Stewart b Maxwell" },
          { name: "Liam Henderson", runs: 15, balls: 22, fours: 1, sixes: 0, strikeRate: 68.2, dismissal: "lbw b Ahmed" },
          { name: "Ross Campbell", runs: 12, balls: 17, fours: 1, sixes: 0, strikeRate: 70.6, dismissal: "b Maxwell" },
          { name: "Jamie Thomson", runs: 9, balls: 13, fours: 1, sixes: 0, strikeRate: 69.2, dismissal: "b Taylor" },
          { name: "Stuart McGill", runs: 4, balls: 8, fours: 0, sixes: 0, strikeRate: 50.0, dismissal: "c Ahmed b Taylor" },
        ],
        bowlers: [
          { name: "Z. Ahmed", overs: "8", maidens: 1, runs: 22, wickets: 3, economy: 2.75 },
          { name: "K. Maxwell", overs: "7.3", maidens: 2, runs: 26, wickets: 3, economy: 3.47 },
          { name: "R. Taylor", overs: "7", maidens: 0, runs: 28, wickets: 2, economy: 4.0 },
          { name: "M. Stewart", overs: "6", maidens: 0, runs: 26, wickets: 0, economy: 4.33 },
        ],
      },
      {
        battingTeam: "Kelburne CC",
        totalRuns: 103,
        totalWickets: 3,
        totalOvers: "22.0",
        extras: 5,
        batters: [
          { name: "Zain Ahmed", runs: 41, balls: 48, fours: 5, sixes: 1, strikeRate: 85.4, dismissal: "c Morrison b Henderson" },
          { name: "Kevin Maxwell", runs: 28, balls: 35, fours: 3, sixes: 0, strikeRate: 80.0, dismissal: null },
          { name: "Ryan Taylor", runs: 22, balls: 28, fours: 2, sixes: 0, strikeRate: 78.6, dismissal: null },
          { name: "Mark Stewart", runs: 12, balls: 16, fours: 1, sixes: 0, strikeRate: 75.0, dismissal: "b Thomson" },
        ],
        bowlers: [
          { name: "Liam Henderson", overs: "6", maidens: 1, runs: 22, wickets: 1, economy: 3.67 },
          { name: "Jamie Thomson", overs: "5", maidens: 0, runs: 24, wickets: 1, economy: 4.8 },
          { name: "Callum Morrison", overs: "5", maidens: 0, runs: 28, wickets: 0, economy: 5.6 },
          { name: "Ross Campbell", overs: "4", maidens: 0, runs: 22, wickets: 1, economy: 5.5 },
          { name: "David Reid", overs: "2", maidens: 0, runs: 7, wickets: 0, economy: 3.5 },
        ],
      },
    ],
  },
  "mock-game-5": {
    game: MOCK_GAMES[4],
    innings: [
      {
        battingTeam: "Mearns Cricket Club",
        totalRuns: 198,
        totalWickets: 7,
        totalOvers: "40",
        extras: 10,
        batters: [
          { name: "Callum Morrison", runs: 78, balls: 95, fours: 9, sixes: 2, strikeRate: 82.1, dismissal: "c Burns b O'Brien" },
          { name: "David Reid", runs: 47, balls: 60, fours: 5, sixes: 1, strikeRate: 78.3, dismissal: "b Murphy" },
          { name: "Liam Henderson", runs: 31, balls: 38, fours: 3, sixes: 1, strikeRate: 81.6, dismissal: "lbw b Burns" },
          { name: "Ross Campbell", runs: 21, balls: 26, fours: 2, sixes: 0, strikeRate: 80.8, dismissal: "c O'Brien b Murphy" },
          { name: "Jamie Thomson", runs: 11, balls: 14, fours: 1, sixes: 0, strikeRate: 78.6, dismissal: "b O'Brien" },
        ],
        bowlers: [
          { name: "J. O'Brien", overs: "8", maidens: 0, runs: 42, wickets: 2, economy: 5.25 },
          { name: "P. Murphy", overs: "8", maidens: 1, runs: 38, wickets: 2, economy: 4.75 },
          { name: "S. Burns", overs: "8", maidens: 0, runs: 44, wickets: 1, economy: 5.5 },
          { name: "M. Doherty", overs: "8", maidens: 0, runs: 40, wickets: 1, economy: 5.0 },
          { name: "C. Kelly", overs: "8", maidens: 0, runs: 34, wickets: 1, economy: 4.25 },
        ],
      },
      {
        battingTeam: "Ayr CC",
        totalRuns: 198,
        totalWickets: 7,
        totalOvers: "40",
        extras: 12,
        batters: [
          { name: "Sean Burns", runs: 71, balls: 88, fours: 8, sixes: 2, strikeRate: 80.7, dismissal: "b Henderson" },
          { name: "John O'Brien", runs: 44, balls: 55, fours: 5, sixes: 0, strikeRate: 80.0, dismissal: "c Campbell b Thomson" },
          { name: "Patrick Murphy", runs: 33, balls: 41, fours: 3, sixes: 1, strikeRate: 80.5, dismissal: "b McGill" },
          { name: "Michael Doherty", runs: 22, balls: 28, fours: 2, sixes: 0, strikeRate: 78.6, dismissal: null },
          { name: "Connor Kelly", runs: 16, balls: 21, fours: 1, sixes: 1, strikeRate: 76.2, dismissal: null },
        ],
        bowlers: [
          { name: "Liam Henderson", overs: "8", maidens: 1, runs: 36, wickets: 2, economy: 4.5 },
          { name: "Jamie Thomson", overs: "8", maidens: 0, runs: 41, wickets: 2, economy: 5.13 },
          { name: "Stuart McGill", overs: "8", maidens: 1, runs: 38, wickets: 1, economy: 4.75 },
          { name: "Ross Campbell", overs: "8", maidens: 0, runs: 45, wickets: 1, economy: 5.63 },
          { name: "David Reid", overs: "8", maidens: 0, runs: 38, wickets: 1, economy: 4.75 },
        ],
      },
    ],
  },

  // ── 2025 Pre-Season Friendlies ───────────────────────────────────────────
  "ps-2025-1": {
    game: MOCK_GAMES[MOCK_GAMES.length - 7],
    innings: [
      {
        battingTeam: "St. Michaels CC",
        totalRuns: 142, totalWickets: 10, totalOvers: "47.3", extras: 9,
        batters: [
          { name: "A. Fraser", runs: 44, balls: 58, fours: 5, sixes: 0, strikeRate: 75.9, dismissal: "b Henderson" },
          { name: "B. Kerr", runs: 31, balls: 42, fours: 3, sixes: 0, strikeRate: 73.8, dismissal: "c Morrison b Thomson" },
          { name: "C. Nairn", runs: 27, balls: 35, fours: 2, sixes: 1, strikeRate: 77.1, dismissal: "lbw b McGill" },
          { name: "D. Lang", runs: 19, balls: 28, fours: 1, sixes: 0, strikeRate: 67.9, dismissal: "b Henderson" },
        ],
        bowlers: [
          { name: "Liam Henderson", overs: "10", maidens: 2, runs: 28, wickets: 4, economy: 2.8 },
          { name: "Jamie Thomson", overs: "10", maidens: 1, runs: 32, wickets: 2, economy: 3.2 },
          { name: "Stuart McGill", overs: "10", maidens: 0, runs: 36, wickets: 2, economy: 3.6 },
          { name: "Ross Campbell", overs: "10", maidens: 0, runs: 30, wickets: 1, economy: 3.0 },
          { name: "David Reid", overs: "7.3", maidens: 0, runs: 16, wickets: 1, economy: 2.13 },
        ],
      },
      {
        battingTeam: "Mearns Cricket Club",
        totalRuns: 156, totalWickets: 6, totalOvers: "50", extras: 8,
        batters: [
          { name: "Callum Morrison", runs: 58, balls: 72, fours: 7, sixes: 1, strikeRate: 80.6, dismissal: "c Fraser b Kerr" },
          { name: "David Reid", runs: 41, balls: 55, fours: 4, sixes: 0, strikeRate: 74.5, dismissal: "b Nairn" },
          { name: "Liam Henderson", runs: 28, balls: 36, fours: 3, sixes: 0, strikeRate: 77.8, dismissal: "c Lang b Fraser" },
          { name: "Ross Campbell", runs: 14, balls: 19, fours: 1, sixes: 0, strikeRate: 73.7, dismissal: null },
          { name: "Jamie Thomson", runs: 11, balls: 15, fours: 1, sixes: 0, strikeRate: 73.3, dismissal: null },
        ],
        bowlers: [
          { name: "A. Fraser", overs: "10", maidens: 1, runs: 38, wickets: 2, economy: 3.8 },
          { name: "B. Kerr", overs: "10", maidens: 0, runs: 34, wickets: 1, economy: 3.4 },
          { name: "C. Nairn", overs: "10", maidens: 1, runs: 30, wickets: 1, economy: 3.0 },
          { name: "D. Lang", overs: "10", maidens: 0, runs: 36, wickets: 1, economy: 3.6 },
          { name: "E. Mackay", overs: "10", maidens: 0, runs: 18, wickets: 1, economy: 1.8 },
        ],
      },
    ],
  },
  "ps-2025-2": {
    game: MOCK_GAMES[MOCK_GAMES.length - 6],
    innings: [
      {
        battingTeam: "Mearns Cricket Club",
        totalRuns: 178, totalWickets: 5, totalOvers: "50", extras: 10,
        batters: [
          { name: "Callum Morrison", runs: 71, balls: 88, fours: 8, sixes: 2, strikeRate: 80.7, dismissal: "c Harris b Milne" },
          { name: "David Reid", runs: 48, balls: 62, fours: 5, sixes: 0, strikeRate: 77.4, dismissal: "b Dobson" },
          { name: "Liam Henderson", runs: 32, balls: 40, fours: 3, sixes: 1, strikeRate: 80.0, dismissal: null },
          { name: "Ross Campbell", runs: 16, balls: 22, fours: 1, sixes: 0, strikeRate: 72.7, dismissal: null },
          { name: "Jamie Thomson", runs: 11, balls: 14, fours: 1, sixes: 0, strikeRate: 78.6, dismissal: null },
        ],
        bowlers: [
          { name: "G. Milne", overs: "10", maidens: 0, runs: 42, wickets: 2, economy: 4.2 },
          { name: "R. Dobson", overs: "10", maidens: 1, runs: 36, wickets: 1, economy: 3.6 },
          { name: "P. Harris", overs: "10", maidens: 0, runs: 38, wickets: 1, economy: 3.8 },
          { name: "S. Young", overs: "10", maidens: 0, runs: 40, wickets: 0, economy: 4.0 },
          { name: "M. Bell", overs: "10", maidens: 0, runs: 22, wickets: 1, economy: 2.2 },
        ],
      },
      {
        battingTeam: "Milngavie CC",
        totalRuns: 145, totalWickets: 9, totalOvers: "50", extras: 11,
        batters: [
          { name: "G. Milne", runs: 49, balls: 63, fours: 6, sixes: 0, strikeRate: 77.8, dismissal: "c Morrison b Henderson" },
          { name: "R. Dobson", runs: 38, balls: 51, fours: 4, sixes: 0, strikeRate: 74.5, dismissal: "b Thomson" },
          { name: "P. Harris", runs: 24, balls: 31, fours: 2, sixes: 1, strikeRate: 77.4, dismissal: "lbw b Campbell" },
          { name: "S. Young", runs: 18, balls: 24, fours: 1, sixes: 0, strikeRate: 75.0, dismissal: "b McGill" },
        ],
        bowlers: [
          { name: "Liam Henderson", overs: "10", maidens: 2, runs: 24, wickets: 3, economy: 2.4 },
          { name: "Jamie Thomson", overs: "10", maidens: 1, runs: 30, wickets: 2, economy: 3.0 },
          { name: "Stuart McGill", overs: "10", maidens: 0, runs: 32, wickets: 2, economy: 3.2 },
          { name: "Ross Campbell", overs: "10", maidens: 0, runs: 36, wickets: 1, economy: 3.6 },
          { name: "Callum Morrison", overs: "10", maidens: 0, runs: 23, wickets: 1, economy: 2.3 },
        ],
      },
    ],
  },
  "ps-2025-3": {
    game: MOCK_GAMES[MOCK_GAMES.length - 5],
    innings: [
      {
        battingTeam: "Mearns Cricket Club",
        totalRuns: 121, totalWickets: 10, totalOvers: "38.2", extras: 7,
        batters: [
          { name: "Callum Morrison", runs: 38, balls: 51, fours: 4, sixes: 0, strikeRate: 74.5, dismissal: "b McAllister" },
          { name: "David Reid", runs: 28, balls: 38, fours: 3, sixes: 0, strikeRate: 73.7, dismissal: "c Glen b Currie" },
          { name: "Liam Henderson", runs: 22, balls: 30, fours: 2, sixes: 0, strikeRate: 73.3, dismissal: "lbw b McAllister" },
          { name: "Ross Campbell", runs: 14, balls: 20, fours: 1, sixes: 0, strikeRate: 70.0, dismissal: "b Glen" },
          { name: "Jamie Thomson", runs: 9, balls: 14, fours: 1, sixes: 0, strikeRate: 64.3, dismissal: "b Currie" },
          { name: "Stuart McGill", runs: 4, balls: 8, fours: 0, sixes: 0, strikeRate: 50.0, dismissal: "c Currie b Glen" },
        ],
        bowlers: [
          { name: "J. McAllister", overs: "8", maidens: 2, runs: 22, wickets: 3, economy: 2.75 },
          { name: "K. Currie", overs: "8", maidens: 1, runs: 26, wickets: 3, economy: 3.25 },
          { name: "F. Glen", overs: "8", maidens: 0, runs: 28, wickets: 2, economy: 3.5 },
          { name: "H. Roy", overs: "8", maidens: 0, runs: 24, wickets: 1, economy: 3.0 },
          { name: "I. Bain", overs: "6.2", maidens: 0, runs: 21, wickets: 1, economy: 3.32 },
        ],
      },
      {
        battingTeam: "Bute CC",
        totalRuns: 122, totalWickets: 3, totalOvers: "30.4", extras: 8,
        batters: [
          { name: "J. McAllister", runs: 51, balls: 60, fours: 6, sixes: 1, strikeRate: 85.0, dismissal: "c Reid b Henderson" },
          { name: "K. Currie", runs: 34, balls: 43, fours: 4, sixes: 0, strikeRate: 79.1, dismissal: null },
          { name: "F. Glen", runs: 22, balls: 30, fours: 2, sixes: 0, strikeRate: 73.3, dismissal: null },
          { name: "H. Roy", runs: 11, balls: 17, fours: 1, sixes: 0, strikeRate: 64.7, dismissal: "b Thomson" },
        ],
        bowlers: [
          { name: "Liam Henderson", overs: "8", maidens: 1, runs: 26, wickets: 1, economy: 3.25 },
          { name: "Jamie Thomson", overs: "7.4", maidens: 0, runs: 30, wickets: 1, economy: 3.91 },
          { name: "Ross Campbell", overs: "8", maidens: 0, runs: 32, wickets: 0, economy: 4.0 },
          { name: "Stuart McGill", overs: "7", maidens: 0, runs: 34, wickets: 1, economy: 4.86 },
        ],
      },
    ],
  },
  "ps-2025-4": {
    game: MOCK_GAMES[MOCK_GAMES.length - 4],
    innings: [
      {
        battingTeam: "Mearns Cricket Club",
        totalRuns: 165, totalWickets: 4, totalOvers: "40", extras: 9,
        batters: [
          { name: "Callum Morrison", runs: 64, balls: 78, fours: 7, sixes: 1, strikeRate: 82.1, dismissal: "b Telfer" },
          { name: "David Reid", runs: 47, balls: 59, fours: 5, sixes: 0, strikeRate: 79.7, dismissal: "c Findlay b Grant" },
          { name: "Liam Henderson", runs: 29, balls: 36, fours: 3, sixes: 0, strikeRate: 80.6, dismissal: null },
          { name: "Ross Campbell", runs: 16, balls: 21, fours: 1, sixes: 0, strikeRate: 76.2, dismissal: null },
        ],
        bowlers: [
          { name: "L. Telfer", overs: "8", maidens: 1, runs: 34, wickets: 2, economy: 4.25 },
          { name: "M. Grant", overs: "8", maidens: 0, runs: 38, wickets: 1, economy: 4.75 },
          { name: "N. Findlay", overs: "8", maidens: 0, runs: 36, wickets: 0, economy: 4.5 },
          { name: "O. Hay", overs: "8", maidens: 0, runs: 30, wickets: 1, economy: 3.75 },
          { name: "P. Reid", overs: "8", maidens: 0, runs: 27, wickets: 0, economy: 3.38 },
        ],
      },
      {
        battingTeam: "Accies 2nd",
        totalRuns: 123, totalWickets: 10, totalOvers: "35.1", extras: 10,
        batters: [
          { name: "L. Telfer", runs: 39, balls: 52, fours: 4, sixes: 0, strikeRate: 75.0, dismissal: "b Henderson" },
          { name: "M. Grant", runs: 28, balls: 38, fours: 3, sixes: 0, strikeRate: 73.7, dismissal: "c Morrison b Thomson" },
          { name: "N. Findlay", runs: 21, balls: 29, fours: 2, sixes: 0, strikeRate: 72.4, dismissal: "lbw b McGill" },
          { name: "O. Hay", runs: 14, balls: 20, fours: 1, sixes: 0, strikeRate: 70.0, dismissal: "b Henderson" },
        ],
        bowlers: [
          { name: "Liam Henderson", overs: "8", maidens: 2, runs: 20, wickets: 4, economy: 2.5 },
          { name: "Jamie Thomson", overs: "8", maidens: 1, runs: 26, wickets: 2, economy: 3.25 },
          { name: "Stuart McGill", overs: "8", maidens: 0, runs: 30, wickets: 2, economy: 3.75 },
          { name: "Ross Campbell", overs: "7.1", maidens: 0, runs: 28, wickets: 1, economy: 3.91 },
          { name: "David Reid", overs: "4", maidens: 0, runs: 19, wickets: 1, economy: 4.75 },
        ],
      },
    ],
  },
  "ps-2025-5": {
    game: MOCK_GAMES[MOCK_GAMES.length - 3],
    innings: [
      {
        battingTeam: "Mearns Cricket Club",
        totalRuns: 147, totalWickets: 8, totalOvers: "40", extras: 11,
        batters: [
          { name: "Callum Morrison", runs: 52, balls: 68, fours: 6, sixes: 0, strikeRate: 76.5, dismissal: "b Connelly" },
          { name: "David Reid", runs: 38, balls: 51, fours: 4, sixes: 0, strikeRate: 74.5, dismissal: "c Burns b Connelly" },
          { name: "Liam Henderson", runs: 24, balls: 33, fours: 2, sixes: 0, strikeRate: 72.7, dismissal: "run out" },
          { name: "Ross Campbell", runs: 16, balls: 22, fours: 1, sixes: 0, strikeRate: 72.7, dismissal: "b Steele" },
          { name: "Jamie Thomson", runs: 9, balls: 13, fours: 1, sixes: 0, strikeRate: 69.2, dismissal: null },
        ],
        bowlers: [
          { name: "Q. Connelly", overs: "8", maidens: 1, runs: 30, wickets: 3, economy: 3.75 },
          { name: "R. Steele", overs: "8", maidens: 1, runs: 28, wickets: 2, economy: 3.5 },
          { name: "S. Burns", overs: "8", maidens: 0, runs: 36, wickets: 1, economy: 4.5 },
          { name: "T. Frame", overs: "8", maidens: 0, runs: 32, wickets: 1, economy: 4.0 },
          { name: "U. Ness", overs: "8", maidens: 0, runs: 21, wickets: 1, economy: 2.63 },
        ],
      },
      {
        battingTeam: "Ayr 2nd/3rd",
        totalRuns: 143, totalWickets: 10, totalOvers: "39.4", extras: 12,
        batters: [
          { name: "Q. Connelly", runs: 48, balls: 60, fours: 5, sixes: 1, strikeRate: 80.0, dismissal: "c Reid b Henderson" },
          { name: "R. Steele", runs: 35, balls: 47, fours: 4, sixes: 0, strikeRate: 74.5, dismissal: "b Thomson" },
          { name: "S. Burns", runs: 26, balls: 36, fours: 2, sixes: 1, strikeRate: 72.2, dismissal: "lbw b McGill" },
          { name: "T. Frame", runs: 18, balls: 24, fours: 1, sixes: 0, strikeRate: 75.0, dismissal: "b Henderson" },
          { name: "U. Ness", runs: 9, balls: 14, fours: 0, sixes: 0, strikeRate: 64.3, dismissal: "b Campbell" },
        ],
        bowlers: [
          { name: "Liam Henderson", overs: "8", maidens: 2, runs: 26, wickets: 3, economy: 3.25 },
          { name: "Jamie Thomson", overs: "8", maidens: 1, runs: 30, wickets: 2, economy: 3.75 },
          { name: "Stuart McGill", overs: "8", maidens: 0, runs: 32, wickets: 2, economy: 4.0 },
          { name: "Ross Campbell", overs: "8", maidens: 0, runs: 34, wickets: 1, economy: 4.25 },
          { name: "Callum Morrison", overs: "7.4", maidens: 0, runs: 21, wickets: 2, economy: 2.74 },
        ],
      },
    ],
  },
  "ps-2025-6": {
    game: MOCK_GAMES[MOCK_GAMES.length - 2],
    innings: [
      {
        battingTeam: "Mearns Cricket Club",
        totalRuns: 189, totalWickets: 5, totalOvers: "40", extras: 9,
        batters: [
          { name: "Callum Morrison", runs: 76, balls: 91, fours: 9, sixes: 2, strikeRate: 83.5, dismissal: "c Kerr b Allan" },
          { name: "David Reid", runs: 54, balls: 67, fours: 6, sixes: 1, strikeRate: 80.6, dismissal: "b Kerr" },
          { name: "Liam Henderson", runs: 33, balls: 40, fours: 3, sixes: 1, strikeRate: 82.5, dismissal: null },
          { name: "Ross Campbell", runs: 19, balls: 24, fours: 2, sixes: 0, strikeRate: 79.2, dismissal: null },
          { name: "Jamie Thomson", runs: 7, balls: 10, fours: 0, sixes: 0, strikeRate: 70.0, dismissal: null },
        ],
        bowlers: [
          { name: "W. Kerr", overs: "8", maidens: 1, runs: 38, wickets: 2, economy: 4.75 },
          { name: "X. Allan", overs: "8", maidens: 0, runs: 42, wickets: 1, economy: 5.25 },
          { name: "Y. Stark", overs: "8", maidens: 0, runs: 40, wickets: 1, economy: 5.0 },
          { name: "Z. Boyd", overs: "8", maidens: 0, runs: 36, wickets: 0, economy: 4.5 },
          { name: "A. Low", overs: "8", maidens: 0, runs: 33, wickets: 1, economy: 4.13 },
        ],
      },
      {
        battingTeam: "Milngavie 2nd",
        totalRuns: 167, totalWickets: 8, totalOvers: "40", extras: 14,
        batters: [
          { name: "W. Kerr", runs: 55, balls: 69, fours: 6, sixes: 1, strikeRate: 79.7, dismissal: "b Henderson" },
          { name: "X. Allan", runs: 41, balls: 54, fours: 4, sixes: 0, strikeRate: 75.9, dismissal: "c Morrison b Thomson" },
          { name: "Y. Stark", runs: 28, balls: 38, fours: 3, sixes: 0, strikeRate: 73.7, dismissal: "lbw b McGill" },
          { name: "Z. Boyd", runs: 21, balls: 29, fours: 2, sixes: 0, strikeRate: 72.4, dismissal: "b Campbell" },
          { name: "A. Low", runs: 12, balls: 18, fours: 1, sixes: 0, strikeRate: 66.7, dismissal: "b Henderson" },
        ],
        bowlers: [
          { name: "Liam Henderson", overs: "8", maidens: 2, runs: 28, wickets: 3, economy: 3.5 },
          { name: "Jamie Thomson", overs: "8", maidens: 1, runs: 34, wickets: 2, economy: 4.25 },
          { name: "Stuart McGill", overs: "8", maidens: 0, runs: 36, wickets: 1, economy: 4.5 },
          { name: "Ross Campbell", overs: "8", maidens: 0, runs: 38, wickets: 1, economy: 4.75 },
          { name: "David Reid", overs: "8", maidens: 0, runs: 31, wickets: 1, economy: 3.88 },
        ],
      },
    ],
  },
  "ps-2025-7": {
    game: MOCK_GAMES[MOCK_GAMES.length - 1],
    innings: [
      {
        battingTeam: "Stenhousemuir 2nd",
        totalRuns: 155, totalWickets: 10, totalOvers: "37.2", extras: 10,
        batters: [
          { name: "B. Muir", runs: 48, balls: 62, fours: 5, sixes: 0, strikeRate: 77.4, dismissal: "c Reid b Henderson" },
          { name: "C. Sinclair", runs: 36, balls: 48, fours: 4, sixes: 0, strikeRate: 75.0, dismissal: "b Thomson" },
          { name: "D. Wallace", runs: 28, balls: 38, fours: 3, sixes: 0, strikeRate: 73.7, dismissal: "lbw b McGill" },
          { name: "E. Murray", runs: 19, balls: 26, fours: 1, sixes: 1, strikeRate: 73.1, dismissal: "b Henderson" },
          { name: "F. Payne", runs: 12, balls: 17, fours: 1, sixes: 0, strikeRate: 70.6, dismissal: "b Campbell" },
        ],
        bowlers: [
          { name: "Liam Henderson", overs: "8", maidens: 2, runs: 26, wickets: 4, economy: 3.25 },
          { name: "Jamie Thomson", overs: "8", maidens: 1, runs: 30, wickets: 2, economy: 3.75 },
          { name: "Stuart McGill", overs: "8", maidens: 0, runs: 34, wickets: 2, economy: 4.25 },
          { name: "Ross Campbell", overs: "8", maidens: 0, runs: 38, wickets: 1, economy: 4.75 },
          { name: "Callum Morrison", overs: "5.2", maidens: 0, runs: 27, wickets: 1, economy: 5.06 },
        ],
      },
      {
        battingTeam: "Mearns Cricket Club",
        totalRuns: 198, totalWickets: 7, totalOvers: "40", extras: 11,
        batters: [
          { name: "Callum Morrison", runs: 79, balls: 94, fours: 9, sixes: 3, strikeRate: 84.0, dismissal: "c Murray b Sinclair" },
          { name: "David Reid", runs: 55, balls: 68, fours: 6, sixes: 1, strikeRate: 80.9, dismissal: "b Muir" },
          { name: "Liam Henderson", runs: 34, balls: 42, fours: 3, sixes: 1, strikeRate: 81.0, dismissal: "lbw b Wallace" },
          { name: "Ross Campbell", runs: 18, balls: 24, fours: 1, sixes: 0, strikeRate: 75.0, dismissal: null },
          { name: "Jamie Thomson", runs: 12, balls: 16, fours: 1, sixes: 0, strikeRate: 75.0, dismissal: null },
        ],
        bowlers: [
          { name: "B. Muir", overs: "8", maidens: 1, runs: 38, wickets: 2, economy: 4.75 },
          { name: "C. Sinclair", overs: "8", maidens: 0, runs: 44, wickets: 1, economy: 5.5 },
          { name: "D. Wallace", overs: "8", maidens: 0, runs: 40, wickets: 1, economy: 5.0 },
          { name: "E. Murray", overs: "8", maidens: 0, runs: 42, wickets: 2, economy: 5.25 },
          { name: "F. Payne", overs: "8", maidens: 0, runs: 34, wickets: 1, economy: 4.25 },
        ],
      },
    ],
  },
};

// ── Mock Photos ─────────────────────────────────────────────────────────────

const PHOTO_SEEDS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

export const MOCK_PHOTOS: GooglePhoto[] = PHOTO_SEEDS.map((seed, i) => ({
  id: `mock-photo-${seed}`,
  filename: `match-photo-${i + 1}.jpg`,
  mimeType: "image/jpeg",
  // picsum gives real photos — no auth needed
  baseUrl: `https://picsum.photos/seed/${seed}/600/600`,
  productUrl: `https://photos.google.com/photo/mock-${seed}`,
  mediaMetadata: {
    creationTime: "2026-04-05T14:30:00Z",
    width: "600",
    height: "600",
  },
}));

/**
 * buildPhotoUrl shim for mock photos — picsum already returns a full URL,
 * just return it unchanged.
 */
export function mockBuildPhotoUrl(baseUrl: string): string {
  return baseUrl;
}
