export interface Quote {
  text: string;
  author: string;
  lang: "id" | "en";
}

export const MOTIVATIONAL_QUOTES: Quote[] = [
  // Indonesian
  {
    text: "Kemenangan terbesar adalah mengalahkan diri sendiri.",
    author: "Plato",
    lang: "id",
  },
  {
    text: "Setiap hari tanpa judi adalah kemenangan nyata.",
    author: "Anti-Judi Shield",
    lang: "id",
  },
  {
    text: "Uang yang kamu simpan hari ini adalah masa depan yang kamu bangun.",
    author: "Anti-Judi Shield",
    lang: "id",
  },
  {
    text: "Kecanduan dimulai dari 'sekali lagi'. Berhenti dimulai dari 'tidak lagi'.",
    author: "Anti-Judi Shield",
    lang: "id",
  },
  {
    text: "Keluarga dan orang-orang tercintamu lebih berharga dari jackpot manapun.",
    author: "Anti-Judi Shield",
    lang: "id",
  },
  {
    text: "Yang menang dari judi hanya bandarnya. Kamu bukan bandar.",
    author: "Anti-Judi Shield",
    lang: "id",
  },
  {
    text: "Satu langkah kecil hari ini, perubahan besar esok hari.",
    author: "Anti-Judi Shield",
    lang: "id",
  },
  {
    text: "Bukan soal berapa kali jatuh, tapi berapa kali kamu bangkit.",
    author: "Anti-Judi Shield",
    lang: "id",
  },
  {
    text: "Investasikan waktumu untuk hal yang membuatmu bertumbuh.",
    author: "Anti-Judi Shield",
    lang: "id",
  },
  {
    text: "Kamu lebih kuat dari kebiasaan burukmu.",
    author: "Anti-Judi Shield",
    lang: "id",
  },
  {
    text: "Setiap rupiah yang tidak dijudikan adalah rupiah yang diselamatkan.",
    author: "Anti-Judi Shield",
    lang: "id",
  },
  {
    text: "Hidup terlalu berharga untuk dihabiskan di depan mesin slot.",
    author: "Anti-Judi Shield",
    lang: "id",
  },

  // English
  {
    text: "The greatest victory is the victory over oneself.",
    author: "Plato",
    lang: "en",
  },
  {
    text: "Every day without gambling is a real win.",
    author: "Anti-Judi Shield",
    lang: "en",
  },
  {
    text: "The money you save today builds your tomorrow.",
    author: "Anti-Judi Shield",
    lang: "en",
  },
  {
    text: "Addiction starts with 'one more time'. Recovery starts with 'no more'.",
    author: "Anti-Judi Shield",
    lang: "en",
  },
  {
    text: "Your family is worth more than any jackpot.",
    author: "Anti-Judi Shield",
    lang: "en",
  },
  {
    text: "The house always wins. You are not the house.",
    author: "Anti-Judi Shield",
    lang: "en",
  },
  {
    text: "Small steps today lead to big changes tomorrow.",
    author: "Anti-Judi Shield",
    lang: "en",
  },
  {
    text: "You are stronger than your worst habits.",
    author: "Anti-Judi Shield",
    lang: "en",
  },
];

export function getRandomQuote(lang: "id" | "en" = "id"): Quote {
  const filtered = MOTIVATIONAL_QUOTES.filter((q) => q.lang === lang);
  return filtered[Math.floor(Math.random() * filtered.length)]!;
}
