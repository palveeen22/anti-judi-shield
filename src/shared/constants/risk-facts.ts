export interface RiskFact {
  text: string;
  source: string;
  lang: "id" | "en";
}

export const RISK_FACTS: RiskFact[] = [
  // Indonesian
  {
    text: "97% penjudi online mengalami kerugian finansial dalam jangka panjang.",
    source: "National Council on Problem Gambling",
    lang: "id",
  },
  {
    text: "Penjudi bermasalah memiliki risiko 15x lebih tinggi untuk bunuh diri.",
    source: "Journal of Gambling Studies",
    lang: "id",
  },
  {
    text: "Rata-rata penjudi yang kecanduan memiliki hutang 40-90 juta rupiah.",
    source: "Riset Kecanduan Judi Indonesia",
    lang: "id",
  },
  {
    text: "Judi online dirancang agar kamu kalah. RTP 96% berarti bandar selalu untung 4%.",
    source: "Analisis Industri Gaming",
    lang: "id",
  },
  {
    text: "80% perceraian yang melibatkan judi disebabkan oleh masalah keuangan akibat judi.",
    source: "National Council on Problem Gambling",
    lang: "id",
  },
  {
    text: "Efek dopamin dari judi sama dengan narkoba — otakmu sedang ditipu.",
    source: "American Psychiatric Association",
    lang: "id",
  },
  {
    text: "Situs judi online di Indonesia 100% ilegal dan tidak ada perlindungan konsumen.",
    source: "UU ITE & Kominfo",
    lang: "id",
  },
  {
    text: "'Slot gacor' dan 'jam hoki' adalah mitos. Setiap putaran bersifat acak.",
    source: "Random Number Generator Analysis",
    lang: "id",
  },
  {
    text: "1 dari 5 penjudi bermasalah mencoba bunuh diri.",
    source: "WHO Mental Health Report",
    lang: "id",
  },
  {
    text: "Kecanduan judi bisa menyebabkan depresi, kecemasan, dan insomnia.",
    source: "American Psychological Association",
    lang: "id",
  },

  // English
  {
    text: "97% of online gamblers lose money in the long run.",
    source: "National Council on Problem Gambling",
    lang: "en",
  },
  {
    text: "Problem gamblers are 15x more likely to attempt suicide.",
    source: "Journal of Gambling Studies",
    lang: "en",
  },
  {
    text: "The average problem gambler accumulates $20,000-$50,000 in debt.",
    source: "National Endowment for Financial Education",
    lang: "en",
  },
  {
    text: "Online gambling is designed for you to lose. A 96% RTP means the house always profits.",
    source: "Gaming Industry Analysis",
    lang: "en",
  },
  {
    text: "'Hot slots' and 'lucky times' are myths. Every spin is random.",
    source: "Random Number Generator Analysis",
    lang: "en",
  },
  {
    text: "Gambling addiction triggers the same dopamine response as drugs.",
    source: "American Psychiatric Association",
    lang: "en",
  },
];

export function getRandomFact(lang: "id" | "en" = "id"): RiskFact {
  const filtered = RISK_FACTS.filter((f) => f.lang === lang);
  return filtered[Math.floor(Math.random() * filtered.length)]!;
}
