export const regionsData = [
  {
    id: "north",
    slug: "north",
    number: "01",
    name: "North Ethiopia",
    tagline: "History • Heritage • Ancient Civilizations",
    shortDesc: "The roots of Ethiopian history. Ancient kingdoms, sacred churches, dramatic highlands.",
    signature: "The Historic North",
    heroImage: "https://ambaseltourandtravel.com/wp-content/uploads/2023/12/photo_6022772982541300334_w.jpg",
    discover: [
      "Lalibela", "Gondar", "Axum", "Tigray Highlands",
      "Historic Churches", "Monasteries", "Ancient Heritage"
    ],
    pillars: [
      { icon: "⛪", title: "Sacred Heritage", desc: "Rock churches, monasteries, UNESCO sites" },
      { icon: "👑", title: "Royal History", desc: "Castles of Gondar, kings of Axum" },
      { icon: "⛰️", title: "Highland Drama", desc: "Simien escarpments and alpine wilderness" },
    ],
    relatedTourSlugs: [
      "classic-historic-routes-15-days",
      "historical-route-surface-20-days",
      "simien-mountains-trekking-ras-dashen",
    ],
    relatedDestinationSlugs: ["lalibela", "gondar", "axum", "simien-mountains"],
    color: "from-amber-900 to-stone-950",
  },
  {
    id: "south",
    slug: "south",
    number: "02",
    name: "South Ethiopia",
    tagline: "Culture • Community • Wildlife",
    shortDesc: "Ethiopia's culturally diverse heartland. Traditional communities, wildlife, living traditions.",
    signature: "The Living Cultures of Ethiopia",
    heroImage: "https://ambaseltourandtravel.com/wp-content/uploads/2024/12/photo_5807594854723730140_y.jpg",
    discover: [
      "Omo Valley", "Indigenous Communities", "Traditional Villages",
      "Wildlife", "Markets", "Cultural Landscapes", "Community Tourism"
    ],
    pillars: [
      { icon: "🤝", title: "Living Cultures", desc: "Hamar, Mursi, Karo, Dassenech communities" },
      { icon: "🦁", title: "Wildlife", desc: "Bale wolves, forest elephants, hippos" },
      { icon: "🌾", title: "Rift Valley", desc: "Lakes, savannahs, traditional landscapes" },
    ],
    relatedTourSlugs: [
      "southern-omo-valley-tribal-13-days",
      "southern-omo-valley-arba-minch-5-days",
    ],
    relatedDestinationSlugs: ["omo-valley", "bale-mountains"],
    color: "from-orange-900 to-stone-950",
  },
  {
    id: "east",
    slug: "east",
    number: "03",
    name: "East Ethiopia",
    tagline: "Culture • The Walled City • Desert Landscapes",
    shortDesc: "Cultural crossroads of the east. Harar's walls, Afar deserts, ancient traditions.",
    signature: "Harar & the Eastern Cultural Route",
    heroImage: "https://res.cloudinary.com/dw1ohipim/image/upload/v1788194898/zk9zpblet3ph7kjuv53t.jpg",
    discover: [
      "Harar", "The Walled City", "Harari Culture", "Dire Dawa",
      "Afar", "Markets", "Traditional Houses", "Desert Landscapes"
    ],
    pillars: [
      { icon: "🕌", title: "The Walled City", desc: "Harar Jugol, 82 mosques, Islamic heritage" },
      { icon: "🏜️", title: "Afar Desert", desc: "Danakil, Erta Ale volcano, salt caravans" },
      { icon: "🐘", title: "Wild East", desc: "Babile elephants, Kundudo wild horses" },
    ],
    relatedTourSlugs: [
      "awash-national-park-harar-5-days",
      "danakil-depression-erta-ale",
      "alay-dege-wildlife-reserve-5-days",
    ],
    relatedDestinationSlugs: ["harar", "danakil-depression"],
    color: "from-red-950 to-stone-950",
  },
  {
    id: "west",
    slug: "west",
    number: "04",
    name: "West Ethiopia",
    tagline: "Coffee • Forests • Rivers • Community",
    shortDesc: "Ethiopia's green west. Coffee landscapes, ancient forests, welcoming communities.",
    signature: "The Western Coffee & Forest Route",
    heroImage: "https://ambaseltourandtravel.com/wp-content/uploads/2024/01/photo_2024-01-09_01-14-21.jpg",
    discover: [
      "Kaffa", "Jimma", "Coffee Forests", "Coffee Farms",
      "Wildlife", "Rivers", "Community Life", "Ecotourism"
    ],
    pillars: [
      { icon: "☕", title: "Coffee Origin", desc: "Where coffee was born — Kaffa forests" },
      { icon: "🌳", title: "Ancient Forests", desc: "Biodiverse ecosystems, wildlife corridors" },
      { icon: "🌊", title: "Rivers & Wildlife", desc: "Chebera-Churchura, Gambella wetlands" },
    ],
    relatedTourSlugs: [
      "chebera-churchura-elephant-wilderness-5-days",
    ],
    relatedDestinationSlugs: ["chebera-churchura"],
    color: "from-green-950 to-stone-950",
  },
  {
    id: "coffee-route",
    slug: "coffee-route",
    number: "05",
    name: "The Ethiopian Coffee Route",
    tagline: "From the Birthplace of Coffee to the World",
    shortDesc: "Follow coffee from forest to cup across Kaffa, Jimma, Sidama, Yirgacheffe, and Guji.",
    signature: "The National Coffee Route",
    heroImage: "https://ambaseltourandtravel.com/wp-content/uploads/2023/12/photo_6013931637743660605_w.jpg",
    discover: [
      "Coffee Origins", "Coffee Farms", "Forest Coffee", "Farmers",
      "Traditional Coffee Ceremony", "Roasting", "Tasting", "Farm-to-Cup"
    ],
    pillars: [
      { icon: "🌱", title: "Forest to Farm", desc: "Visit coffee's wild origins and growers" },
      { icon: "🔥", title: "Roasting Rituals", desc: "Traditional ceremony across regions" },
      { icon: "☕", title: "Farm to Cup", desc: "Yirgacheffe, Sidama, Guji tastings" },
    ],
    relatedTourSlugs: [],
    relatedDestinationSlugs: [],
    color: "from-stone-800 to-stone-950",
    featured: true,
    specialBanner: "☕ ETHIOPIA — WHERE COFFEE BEGINS.",
  },
];

export const fiveWaysToDiscover = {
  headline: "DINQ's Five Ways to Discover Ethiopia",
  subheadline: "One Country. Many Worlds. One Extraordinary Journey.",
  ways: [
    { region: "NORTH", action: "Discover History", desc: "Ancient civilizations, heritage and sacred landscapes." },
    { region: "SOUTH", action: "Experience Culture", desc: "Living traditions, communities and extraordinary diversity." },
    { region: "EAST", action: "Enter the Walled City", desc: "Harar, cultural crossroads and eastern landscapes." },
    { region: "WEST", action: "Follow the Coffee", desc: "Forests, coffee origins, nature and community." },
    { region: "COFFEE ROUTE", action: "Taste the Origin", desc: "Follow Ethiopia's coffee story from forest to cup." },
  ],
};

export function getRegionBySlug(slug) {
  return regionsData.find((r) => r.slug === slug);
}

export default regionsData;