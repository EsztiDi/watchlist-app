import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";

var countries = [
  "AU",
  "BG",
  "CA",
  "DK",
  "GR",
  "HK",
  "HU",
  "ID",
  "IE",
  "IN",
  "LT",
  "LV",
  "MY",
  "NL",
  "NO",
  "NZ",
  "PH",
  "PL",
  "RO",
  "SE",
  "SG",
  "TH",
  "TW",
  "US",
  "ZA",
];

export default function JustWatchLink({ loc, locale, title, classes }) {
  var justWatchLink = `https://www.justwatch.com/${
    loc === "GB" || locale === "GB"
      ? "UK"
      : countries.includes(loc)
      ? loc
      : countries.includes(locale)
      ? locale
      : "us"
  }/search?q=${encodeURIComponent(title)}`;

  return (
    <a
      href={justWatchLink}
      target="_blank"
      rel="noopener noreferrer"
      className={classes.external}
    >
      <PlayArrowRoundedIcon className={classes.miniIcon} />
      JustWatch
    </a>
  );
}
