/**
 * URL MIGRATION & 301 REDIRECT MAP
 * Ensures 100% preservation of search engine indexation and legacy bookmarks
 * from https://ambaseltourandtravel.com to https://dinqethiopiatours.com
 */
export const migrationMap = [
  // Core Pages
  { oldUrl: "/", newUrl: "/", status: 301, reason: "Homepage rebrand" },
  { oldUrl: "/about-us/", newUrl: "/about", status: 301, reason: "About DINQ page" },
  { oldUrl: "/about-us", newUrl: "/about", status: 301, reason: "About DINQ page" },
  { oldUrl: "/contact-us/", newUrl: "/contact", status: 301, reason: "Contact DINQ page" },
  { oldUrl: "/contact-us", newUrl: "/contact", status: 301, reason: "Contact DINQ page" },
  { oldUrl: "/trips-advertsement/", newUrl: "/tours#upcoming-departures", status: 301, reason: "Upcoming trips hub" },
  { oldUrl: "/trips-advertsement", newUrl: "/tours#upcoming-departures", status: 301, reason: "Upcoming trips hub" },
  { oldUrl: "/destination/", newUrl: "/destinations", status: 301, reason: "Destinations catalog" },
  { oldUrl: "/destination", newUrl: "/destinations", status: 301, reason: "Destinations catalog" },

  // Old Tour URLs (/trip/[slug]) to New Clean Tour URLs (/tours/[slug])
  {
    oldUrl: "/trip/danakil-depression/",
    newUrl: "/tours/danakil-depression-erta-ale",
    status: 301,
    reason: "Danakil 4-day tour page",
  },
  {
    oldUrl: "/trip/danakil-depression",
    newUrl: "/tours/danakil-depression-erta-ale",
    status: 301,
  },
  {
    oldUrl: "/trip/simien-mountains-trekking/",
    newUrl: "/tours/simien-mountains-trekking-ras-dashen",
    status: 301,
    reason: "Simien Mountains 10-day trekking page",
  },
  {
    oldUrl: "/trip/simien-mountains-trekking",
    newUrl: "/tours/simien-mountains-trekking-ras-dashen",
    status: 301,
  },
  {
    oldUrl: "/trip/the-historic-routes-tour-15-days/",
    newUrl: "/tours/classic-historic-routes-15-days",
    status: 301,
    reason: "15-Day Historic route tour page",
  },
  {
    oldUrl: "/trip/the-historic-routes-tour-15-days",
    newUrl: "/tours/classic-historic-routes-15-days",
    status: 301,
  },
  {
    oldUrl: "/trip/historical-route-by-surface-20-days/",
    newUrl: "/tours/historical-route-surface-20-days",
    status: 301,
    reason: "20-Day Surface Historic route tour page",
  },
  {
    oldUrl: "/trip/historical-route-by-surface-20-days",
    newUrl: "/tours/historical-route-surface-20-days",
    status: 301,
  },
  {
    oldUrl: "/trip/discover-the-southern-omo-valley-and-arba-minch/",
    newUrl: "/tours/southern-omo-valley-arba-minch-5-days",
    status: 301,
    reason: "5-Day Omo Valley express tour page",
  },
  {
    oldUrl: "/trip/discover-the-southern-omo-valley-and-arba-minch",
    newUrl: "/tours/southern-omo-valley-arba-minch-5-days",
    status: 301,
  },
  {
    oldUrl: "/trip/omo-valley-tribal-cultural-tour/",
    newUrl: "/tours/southern-omo-valley-tribal-13-days",
    status: 301,
    reason: "13-Day Omo Valley tribal expedition tour page",
  },
  {
    oldUrl: "/trip/omo-valley-tribal-cultural-tour",
    newUrl: "/tours/southern-omo-valley-tribal-13-days",
    status: 301,
  },
  {
    oldUrl: "/trip/birding/",
    newUrl: "/tours/birding-horn-of-africa-20-days",
    status: 301,
    reason: "20-Day Endemic birding tour page",
  },
  {
    oldUrl: "/trip/birding",
    newUrl: "/tours/birding-horn-of-africa-20-days",
    status: 301,
  },
  {
    oldUrl: "/trip/addis-ababa-city-tour/",
    newUrl: "/tours/addis-ababa-city-heritage-tour",
    status: 301,
    reason: "1-Day Addis Ababa city tour page",
  },
  {
    oldUrl: "/trip/addis-ababa-city-tour",
    newUrl: "/tours/addis-ababa-city-heritage-tour",
    status: 301,
  },
  {
    oldUrl: "/trip/epiphany-in-gondar-a-timket-celebration-journey/",
    newUrl: "/tours/timket-epiphany-in-gondar-4-days",
    status: 301,
    reason: "4-Day Timket Gondar celebration page",
  },
  {
    oldUrl: "/trip/epiphany-in-gondar-a-timket-celebration-journey",
    newUrl: "/tours/timket-epiphany-in-gondar-4-days",
    status: 301,
  },
  {
    oldUrl: "/trip/festival-tours/",
    newUrl: "/tours/timket-festival-addis-ababa-3-days",
    status: 301,
    reason: "3-Day Timket Addis Ababa celebration page",
  },
  {
    oldUrl: "/trip/festival-tours",
    newUrl: "/tours/timket-festival-addis-ababa-3-days",
    status: 301,
  },
  {
    oldUrl: "/trip/journey-to-the-rock-hewn-wonders-lalibela-christmas-celebration/",
    newUrl: "/tours/lalibela-christmas-genna-4-days",
    status: 301,
    reason: "4-Day Lalibela Christmas Genna page",
  },
  {
    oldUrl: "/trip/journey-to-the-rock-hewn-wonders-lalibela-christmas-celebration",
    newUrl: "/tours/lalibela-christmas-genna-4-days",
    status: 301,
  },
  {
    oldUrl: "/trip/1871/",
    newUrl: "/tours/awash-national-park-harar-5-days",
    status: 301,
    reason: "5-Day Awash & Harar tour page",
  },
  {
    oldUrl: "/trip/1871",
    newUrl: "/tours/awash-national-park-harar-5-days",
    status: 301,
  },
  {
    oldUrl: "/trip/jimma-drive-to-chebera-churchura-national/",
    newUrl: "/tours/chebera-churchura-elephant-wilderness-5-days",
    status: 301,
    reason: "5-Day Chebera Churchura elephant safari page",
  },
  {
    oldUrl: "/trip/jimma-drive-to-chebera-churchura-national",
    newUrl: "/tours/chebera-churchura-elephant-wilderness-5-days",
    status: 301,
  },
  {
    oldUrl: "/trip/wonchi-crater-lake-and-tiya/",
    newUrl: "/tours/wonchi-crater-lake-tiya-2-days",
    status: 301,
    reason: "2-Day Wonchi Crater & Tiya tour page",
  },
  {
    oldUrl: "/trip/wonchi-crater-lake-and-tiya",
    newUrl: "/tours/wonchi-crater-lake-tiya-2-days",
    status: 301,
  },
  {
    oldUrl: "/trip/alay-dege-wildlife-reserve-5-days/",
    newUrl: "/tours/alay-dege-wildlife-reserve-5-days",
    status: 301,
    reason: "5-Day Alay Dege wildlife reserve tour page",
  },
  {
    oldUrl: "/trip/alay-dege-wildlife-reserve-5-days",
    newUrl: "/tours/alay-dege-wildlife-reserve-5-days",
    status: 301,
  },
  {
    oldUrl: "/trip/3-day-afar-adventure/",
    newUrl: "/tours/danakil-depression-erta-ale",
    status: 301,
    reason: "3-Day Afar adventure redirects to Danakil",
  },

  // Old Destination taxonomy to New Clean Destination pages
  {
    oldUrl: "/destinations/erta-ale/",
    newUrl: "/destinations/danakil-depression",
    status: 301,
  },
  {
    oldUrl: "/destinations/addis-ababa/",
    newUrl: "/destinations/addis-ababa",
    status: 301,
  },
  {
    oldUrl: "/destinations/simien-mountains-trekking/",
    newUrl: "/destinations/simien-mountains",
    status: 301,
  },
  {
    oldUrl: "/destinations/omo-valley-tribal-cultural-tour/",
    newUrl: "/destinations/omo-valley",
    status: 301,
  },
  {
    oldUrl: "/destinations/historical-route-by-surface-20-days/",
    newUrl: "/destinations/lalibela",
    status: 301,
  },
  {
    oldUrl: "/destinations/the-historic-routes-tour-discover-the-classic-historic-routes-of-ethiopia/",
    newUrl: "/destinations/lalibela",
    status: 301,
  },
  {
    oldUrl: "/destinations/nature-and-adventure-tours/",
    newUrl: "/tour-types/trekking-hiking",
    status: 301,
  },
  {
    oldUrl: "/destinations/festival-timeket-and-history-route-fehist/",
    newUrl: "/tour-types/festival-tours",
    status: 301,
  },
  {
    oldUrl: "/destinations/3-days-festival-of-timket-in-gondar/",
    newUrl: "/tours/timket-epiphany-in-gondar-4-days",
    status: 301,
  },
  {
    oldUrl: "/destinations/birding/",
    newUrl: "/tour-types/birding-tours",
    status: 301,
  },
];

export function getRedirectForPath(path) {
  // Normalize path
  const cleanPath = path.toLowerCase().replace(/\/$/, "");
  const match = migrationMap.find(
    (item) =>
      item.oldUrl.toLowerCase() === path.toLowerCase() ||
      item.oldUrl.toLowerCase().replace(/\/$/, "") === cleanPath
  );
  return match ? match.newUrl : null;
}

export default migrationMap;
