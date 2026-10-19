import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, MapPin, Mountain, ArrowRight, Sparkles, Navigation } from 'lucide-react';
import gsap from 'gsap';
import { animateSvgPath } from '../../animations/scrollAnimations';

export default function InteractiveMapRoute() {
  const [selectedPin, setSelectedPin] = useState(null);
  const pathNorthRef = useRef(null);
  const pathSouthRef = useRef(null);
  const containerRef = useRef(null);

  const waypoints = [
    {
      id: 'addis',
      name: 'Addis Ababa',
      amharic: 'አዲስ አበባ',
      region: 'Central Highlands',
      altitude: '2,355m',
      x: 390,
      y: 330,
      desc: 'The diplomatic capital and gateway to ancient Abyssinia.',
      tourSlug: 'addis-ababa-city-heritage-tour',
    },
    {
      id: 'bahirdar',
      name: 'Bahir Dar & Lake Tana',
      amharic: 'ባሕር ዳር',
      region: 'Amhara Highlands',
      altitude: '1,830m',
      x: 320,
      y: 240,
      desc: 'Island monasteries dating to the 14th century and Blue Nile Falls.',
      tourSlug: 'classic-historic-routes-15-days',
    },
    {
      id: 'gondar',
      name: 'Gondar Imperial Castles',
      amharic: 'ጎንደር',
      region: 'Amhara',
      altitude: '2,133m',
      x: 310,
      y: 190,
      desc: 'The Camelot of Africa — 17th-century stone palaces and Fasilides Baths.',
      tourSlug: 'timket-epiphany-in-gondar-4-days',
    },
    {
      id: 'simien',
      name: 'Simien Mountains',
      amharic: 'ስሜን ተራሮች',
      region: 'Afro-Alpine UNESCO',
      altitude: '4,543m',
      x: 330,
      y: 140,
      desc: 'Dramatic escarpments, endemic Gelada baboons, and Ras Dashen peak.',
      tourSlug: 'simien-mountains-trekking-ras-dashen',
    },
    {
      id: 'axum',
      name: 'Axum Ancient Kingdom',
      amharic: 'አክሱም',
      region: 'Tigray',
      altitude: '2,130m',
      x: 345,
      y: 90,
      desc: 'Monolithic granite obelisks and home of the sacred Ark of the Covenant.',
      tourSlug: 'historical-route-surface-20-days',
    },
    {
      id: 'lalibela',
      name: 'Lalibela Rock Churches',
      amharic: 'ላሊበላ',
      region: 'Lasta Mountains',
      altitude: '2,500m',
      x: 395,
      y: 210,
      desc: 'Eleven monolithic churches carved out of solid volcanic basalt.',
      tourSlug: 'lalibela-christmas-genna-4-days',
    },
    {
      id: 'danakil',
      name: 'Danakil & Erta Ale',
      amharic: 'ዳሎል እና ኤርታ አሌ',
      region: 'Afar Depression',
      altitude: '-125m',
      x: 460,
      y: 150,
      desc: 'Active bubbling lava lake, sulfur hot springs, and Afar salt pans.',
      tourSlug: 'danakil-depression-erta-ale',
    },
    {
      id: 'harar',
      name: 'Walled City of Harar',
      amharic: 'ሐረር ጁጎል',
      region: 'Eastern Highlands',
      altitude: '1,885m',
      x: 520,
      y: 320,
      desc: 'The 4th holiest Islamic city with 99 mosques and nocturnal hyena men.',
      tourSlug: 'awash-national-park-harar-5-days',
    },
    {
      id: 'bale',
      name: 'Bale Mountains',
      amharic: 'ባሌ ተራሮች',
      region: 'Oromia Highlands',
      altitude: '4,100m',
      x: 430,
      y: 430,
      desc: 'Sanetti Alpine Plateau, Harenna cloud forest, and Ethiopian wolves.',
      tourSlug: 'birding-horn-of-africa-20-days',
    },
    {
      id: 'omo',
      name: 'South Omo Valley',
      amharic: 'ኦሞ ሸለቆ',
      region: 'Southern Rift Valley',
      altitude: '500m',
      x: 310,
      y: 490,
      desc: 'Living anthropological sanctuary: Hamar, Mursi, Karo, and Dassenech.',
      tourSlug: 'southern-omo-valley-tribal-13-days',
    },
  ];

  useEffect(() => {
    const northPath = pathNorthRef.current;
    const southPath = pathSouthRef.current;
    const container = containerRef.current;

    if (northPath && container) {
      animateSvgPath(northPath, container);
    }
    if (southPath && container) {
      animateSvgPath(southPath, container);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-stone-900 rounded-3xl p-6 sm:p-10 border border-stone-800 text-white relative overflow-hidden shadow-2xl"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C88A2E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2D4F38]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D4AF7A] mb-2">
            <Compass className="w-3.5 h-3.5 text-[#C88A2E] animate-spin duration-1000" />
            <span>Interactive Cartography</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold">
            The Trans-Ethiopia Expedition Corridors
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mt-1 max-w-xl">
            Hover or click any waypoint along the Northern Historic Arc and Southern Rift Valley to inspect elevation, landscape, and expedition routes.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#C88A2E]" />
            <span>Historic Circuit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Southern Rift Valley</span>
          </div>
        </div>
      </div>

      {/* Map Graphic Area */}
      <div className="relative aspect-4/3 sm:aspect-16/10 bg-stone-950/80 rounded-2xl border border-stone-800 overflow-hidden flex items-center justify-center p-2 sm:p-6">
        <svg
          viewBox="0 0 700 580"
          className="w-full h-full max-h-[540px] select-none"
          aria-label="Ethiopia Expedition Route Map"
        >
          {/* Topographic Contour Lines */}
          <g opacity="0.12" stroke="#FAF7F2" strokeWidth="1" fill="none">
            <path d="M150 120 C 250 80, 450 60, 560 140 C 620 190, 600 360, 520 440 C 440 500, 240 540, 180 460 C 120 380, 100 200, 150 120 Z" />
            <path d="M220 170 C 290 130, 430 110, 500 170 C 560 220, 540 340, 470 400 C 410 450, 260 470, 220 400 C 180 340, 170 210, 220 170 Z" />
            <path d="M280 210 C 330 170, 410 160, 460 200 C 500 240, 480 320, 430 360 C 380 400, 280 400, 250 350 C 230 300, 240 230, 280 210 Z" />
          </g>

          {/* Great Rift Valley Fissure Line */}
          <path
            d="M 520 80 Q 420 280 300 560"
            stroke="#C88A2E"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.3"
            fill="none"
          />

          {/* Animated Route Line: Northern Historic Arc */}
          {/* Addis -> Bahir Dar -> Gondar -> Simien -> Axum -> Lalibela -> Danakil */}
          <path
            ref={pathNorthRef}
            d="M 390 330 L 320 240 L 310 190 L 330 140 L 345 90 L 395 210 L 460 150"
            stroke="#C88A2E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.8"
          />

          {/* Animated Route Line: Southern Cultural Corridor */}
          {/* Addis -> Bale -> Omo */}
          <path
            ref={pathSouthRef}
            d="M 390 330 L 430 430 L 310 490"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.8"
          />

          {/* Eastern Line: Addis to Harar */}
          <path
            d="M 390 330 L 520 320"
            stroke="#D4AF7A"
            strokeWidth="2"
            strokeDasharray="3 4"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />

          {/* Interactive Waypoint Pins */}
          {waypoints.map((wp) => {
            const isSelected = selectedPin?.id === wp.id;
            return (
              <g
                key={wp.id}
                transform={`translate(${wp.x}, ${wp.y})`}
                className="cursor-pointer group"
                onClick={() => setSelectedPin(wp)}
                onMouseEnter={() => setSelectedPin(wp)}
              >
                {/* Outer Pulse Ring */}
                <circle
                  r={isSelected ? "14" : "9"}
                  className={`transition-all duration-300 ${
                    isSelected
                      ? 'fill-[#C88A2E]/30 stroke-[#C88A2E] stroke-2 animate-ping'
                      : 'fill-[#FAF7F2]/10 stroke-[#C88A2E]/50 group-hover:fill-[#C88A2E]/20'
                  }`}
                />

                {/* Core Pin Dot */}
                <circle
                  r={isSelected ? "6" : "4.5"}
                  className={`transition-all duration-300 ${
                    isSelected
                      ? 'fill-[#FAF7F2] stroke-[#C88A2E] stroke-2'
                      : 'fill-[#C88A2E] group-hover:scale-125'
                  }`}
                />

                {/* Pin Label */}
                <text
                  x="12"
                  y="4"
                  className={`text-[11px] font-sans font-medium transition-all duration-200 ${
                    isSelected
                      ? 'fill-white font-bold text-xs'
                      : 'fill-stone-400 group-hover:fill-white'
                  }`}
                >
                  {wp.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Waypoint Preview Floating Card */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-stone-900/95 backdrop-blur-md p-4 rounded-2xl border border-[#C88A2E]/50 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF7A]">
                  {selectedPin.region} • {selectedPin.altitude}
                </span>
                <h4 className="font-serif text-base font-bold text-white mt-0.5">
                  {selectedPin.name}
                </h4>
                <div className="text-xs text-stone-400 italic mb-2">
                  {selectedPin.amharic}
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {selectedPin.desc}
                </p>
              </div>
              <Link
                to={`/tours/${selectedPin.tourSlug}`}
                className="w-8 h-8 rounded-full bg-[#C88A2E] text-white flex items-center justify-center shrink-0 hover:scale-110 transition-transform"
                title="View Expedition"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
