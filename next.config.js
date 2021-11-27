module.exports = {
  env: {
    BASE_URL:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.NODE_ENV === "preview"
        ? "https://mywatchlists.ml"
        : "https://mywatchlists.watch",
    TMDB_API_KEY: "592e824bf5b4f2ff01f370433fa8060e",
    TMDB_BEARER:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OTJlODI0YmY1YjRmMmZmMDFmMzcwNDMzZmE4MDYwZSIsInN1YiI6IjVmYjAyMWM1M2E0OGM1MDAzYzdkMzIwMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QzwyPUiBvs0HSJdWGc29IKOVuOakq77aKy6sUr_WLtQ",
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
      "pbs.twimg.com",
      "avatars.githubusercontent.com",
      "media-exp3.licdn.com",
      "image.tmdb.org",
      "mywatchlists.watch",
      "mywatchlists.ml",
      "localhost",
    ],
  },
};
