export interface WeightedPhrase {
  phrase: string;
  weight: number;
}

// Weighted phrases for gambling content detection
// Higher weight = more strongly indicates gambling
export const GAMBLING_PHRASES: WeightedPhrase[] = [
  // Payment/deposit indicators (high confidence)
  { phrase: "deposit via dana", weight: 9 },
  { phrase: "deposit via ovo", weight: 9 },
  { phrase: "deposit via gopay", weight: 9 },
  { phrase: "deposit via pulsa", weight: 9 },
  { phrase: "deposit via linkaja", weight: 9 },
  { phrase: "deposit via shopeepay", weight: 9 },
  { phrase: "minimal deposit", weight: 7 },
  { phrase: "deposit 10 ribu", weight: 8 },
  { phrase: "deposit 10rb", weight: 8 },
  { phrase: "deposit 25rb", weight: 8 },
  { phrase: "withdraw cepat", weight: 7 },

  // Slot-specific (very high confidence)
  { phrase: "slot gacor", weight: 10 },
  { phrase: "slot online", weight: 7 },
  { phrase: "rtp live", weight: 9 },
  { phrase: "rtp slot", weight: 9 },
  { phrase: "bocoran slot", weight: 10 },
  { phrase: "pola slot", weight: 9 },
  { phrase: "jam gacor", weight: 9 },
  { phrase: "scatter hitam", weight: 10 },
  { phrase: "scatter gratis", weight: 8 },
  { phrase: "akun pro", weight: 8 },
  { phrase: "server luar", weight: 7 },
  { phrase: "server thailand", weight: 8 },
  { phrase: "server kamboja", weight: 8 },
  { phrase: "server filipina", weight: 8 },

  // Game providers (medium - could be legitimate gaming news)
  { phrase: "pragmatic play", weight: 5 },
  { phrase: "pg soft", weight: 5 },
  { phrase: "habanero slot", weight: 7 },
  { phrase: "spadegaming", weight: 6 },
  { phrase: "microgaming", weight: 5 },
  { phrase: "joker gaming", weight: 6 },

  // Bonuses and promotions
  { phrase: "bonus new member", weight: 8 },
  { phrase: "bonus 100%", weight: 8 },
  { phrase: "bonus deposit", weight: 7 },
  { phrase: "bonus turnover", weight: 8 },
  { phrase: "bonus cashback", weight: 6 },
  { phrase: "bonus referral", weight: 5 },
  { phrase: "freebet", weight: 7 },
  { phrase: "freechip", weight: 7 },
  { phrase: "free spin", weight: 5 },

  // Registration/access
  { phrase: "link alternatif", weight: 8 },
  { phrase: "daftar slot", weight: 9 },
  { phrase: "daftar judi", weight: 10 },
  { phrase: "daftar togel", weight: 10 },
  { phrase: "login slot", weight: 8 },
  { phrase: "situs resmi", weight: 5 },
  { phrase: "situs terpercaya", weight: 6 },
  { phrase: "agen resmi", weight: 6 },
  { phrase: "bandar terpercaya", weight: 7 },

  // Togel-specific
  { phrase: "bandar togel", weight: 10 },
  { phrase: "togel online", weight: 9 },
  { phrase: "prediksi togel", weight: 9 },
  { phrase: "angka jitu", weight: 8 },
  { phrase: "keluaran hk", weight: 8 },
  { phrase: "keluaran sgp", weight: 8 },
  { phrase: "data sydney", weight: 7 },
  { phrase: "result togel", weight: 8 },
  { phrase: "paito warna", weight: 8 },

  // Gambling results
  { phrase: "maxwin", weight: 8 },
  { phrase: "jackpot", weight: 5 },
  { phrase: "jp besar", weight: 8 },
  { phrase: "menang besar", weight: 6 },
  { phrase: "kemenangan", weight: 4 },

  // Generic gambling terms
  { phrase: "judi online", weight: 10 },
  { phrase: "situs judi", weight: 10 },
  { phrase: "agen judi", weight: 10 },
  { phrase: "taruhan bola", weight: 9 },
  { phrase: "mix parlay", weight: 8 },
  { phrase: "live casino", weight: 7 },
  { phrase: "poker online", weight: 7 },
  { phrase: "dominoqq", weight: 8 },
  { phrase: "bandarqq", weight: 8 },

  // International gambling (English)
  { phrase: "online casino", weight: 7 },
  { phrase: "online gambling", weight: 8 },
  { phrase: "sports betting", weight: 7 },
  { phrase: "live betting", weight: 7 },
  { phrase: "place your bet", weight: 7 },
  { phrase: "welcome bonus", weight: 5 },
  { phrase: "no deposit bonus", weight: 7 },
  { phrase: "free spins", weight: 5 },
  { phrase: "slot machine", weight: 6 },
  { phrase: "roulette online", weight: 7 },
  { phrase: "blackjack online", weight: 7 },
  { phrase: "baccarat online", weight: 7 },
  { phrase: "online poker", weight: 6 },
  { phrase: "betting odds", weight: 7 },
  { phrase: "sportsbook", weight: 7 },

  // International brands (high confidence when combined)
  { phrase: "1xbet", weight: 8 },
  { phrase: "bet365", weight: 7 },
  { phrase: "betway", weight: 6 },
  { phrase: "888casino", weight: 8 },
  { phrase: "pokerstars", weight: 6 },
  { phrase: "draftkings", weight: 6 },
  { phrase: "fanduel", weight: 6 },
  { phrase: "stake casino", weight: 8 },
  { phrase: "roobet", weight: 8 },
  { phrase: "bovada", weight: 7 },
  { phrase: "betonline", weight: 7 },
];

// Detection threshold: total score needed to trigger protection
export const DETECTION_THRESHOLD = 15;

// Minimum phrases needed (prevents single high-weight false positive)
export const MIN_PHRASE_MATCHES = 2;
