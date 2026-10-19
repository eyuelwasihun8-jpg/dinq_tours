import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, Mountain, Sparkles, MapPin, Gauge } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../../animations/animationConfig';

export default function HorizontalJourney() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const journeyStops = [
    {
      step: '01',
      id: 'addis',
      title: 'Addis Ababa',
      subtitle: 'The Diplomatic & Cultural Gateway',
      altitude: '2,355m Altitude',
      terrain: 'Eucalyptus Highlands & Urban Heritage',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      description: 'Begin where ancient Abyssinian history meets modern Africa. Stand before 3.2-million-year-old Lucy, climb the Entoto hills for eucalyptus panoramic views, and drink fresh wild coffee brewed over hot coals.',
      tourLink: '/tours/addis-ababa-city-heritage-tour',
      highlights: ['National Museum (Lucy)', 'Entoto Panoramic Ridge', 'Historic Tomoca Coffee Bar'],
    },
    {
      step: '02',
      id: 'simien',
      title: 'Simien Mountains',
      subtitle: 'The Roof of Africa & Razorback Canyons',
      altitude: '4,543m Summit',
      terrain: 'Afro-Alpine Pinnacles & Deep Gorges',
      image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=1200&q=80',
      description: 'Traverse precipitous thousand-meter abysses sculpted by million-year basalt eruptions. Walk alongside peaceful troops of endemic bleeding-heart Gelada baboons grazing on alpine fescue grass.',
      tourLink: '/tours/simien-mountains-trekking-ras-dashen',
      highlights: ['Ras Dashen Peak (4,543m)', 'Troops of 400+ Geladas', 'Jinbar 500m Waterfall Abyss'],
    },
    {
      step: '03',
      id: 'danakil',
      title: 'Danakil Depression',
      subtitle: 'Earth’s Most Alien Geothermal Frontier',
      altitude: '-125m Below Sea Level',
      terrain: 'Hydrothermal Chimneys & Active Lava Lake',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      description: 'Descend to one of the lowest and hottest depressions on Earth. Marvel at the kaleidoscopic sulfur neon springs of Dallol, track Afar camel caravans cutting salt tiles, and peer into the boiling lava lake of Erta Ale.',
      tourLink: '/tours/danakil-depression-erta-ale',
      highlights: ['Erta Ale Shield Volcano', 'Dallol Neon Acid Springs', 'Afar Camel Salt Caravans'],
    },
    {
      step: '04',
      id: 'omo',
      title: 'South Omo Valley',
      subtitle: 'Living Anthropological Sanctuary',
      altitude: '500m River Basin',
      terrain: 'Acacia Savannas & Omo River Delta',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
      description: 'Journey south into the ancient river basin where isolated ethnic groups preserve millennia-old rituals. Experience Hamar bull-jumping rites of passage, Dorze organic bamboo weaving, and intricate Karo body painting.',
      tourLink: '/tours/southern-omo-valley-tribal-13-days',
      highlights: ['Hamar Bull Jumping Ceremony', 'Dorze Beehive Bamboo Homes', 'Karo Ochre Body Painting'],
    },
    {
      step: '05',
      id: 'bale',
      title: 'Bale Mountains',
      subtitle: 'Highland Wolves & Ancient Cloud Forest',
      altitude: '4,100m Plateau',
      terrain: 'Sanetti Afro-Alpine & Harenna Jungle',
      image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80',
      description: 'Cross the Sanetti Plateau, the highest drivable road in Africa, looking for the critically endangered Ethiopian wolf hunting giant root-rats in the morning mist, then drop into the wild Harenna forest.',
      tourLink: '/tours/birding-horn-of-africa-20-days',
      highlights: ['Rare Ethiopian Red Wolf', 'Sanetti High Plateau (4,100m)', 'Harenna Moss-Draped Forest'],
    },
    {
      step: '06',
      id: 'lalibela',
      title: 'Lalibela Monoliths',
      subtitle: 'The Eighth Wonder of the Ancient World',
      altitude: '2,500m Lasta Mountains',
      terrain: 'Volcanic Tuff Rock & Mountain Gorges',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80',
      description: 'Carved straight down into monolithic rose-colored volcanic basalt in the 12th century, these eleven churches remain an active spiritual epicenter. Stand above the cruciform cross of Bet Giyorgis at dawn.',
      tourLink: '/tours/classic-historic-routes-15-days',
      highlights: ['Bet Giyorgis Cruciform Church', 'Subterranean Stone Tunnels', 'Ancient Ge’ez Chanting Liturgy'],
    },
  ];

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const scrollDistance = track.scrollWidth - window.innerWidth + 100;
      if (scrollDistance <= 0) return;

      const tween = gsap.to(track, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1.1,
          start: 'top top',
          end: () => `+=${scrollDistance}`,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        if (tween.scrollTrigger) tween.scrollTrigger.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="bg-[#18181B] text-white py-16 lg:py-24 relative overflow-hidden border-y border-stone-800"
    >
      {/* Background Watermark Typography */}
      <div className="absolute top-8 left-12 text-[14vw] font-serif font-black text-white/[0.03] select-none pointer-events-none whitespace-nowrap">
        ETHIOPIA EXPEDITION
      </div>

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 lg:mb-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D4AF7A]">
              <Compass className="w-3.5 h-3.5 text-[#C88A2E]" />
              <span>Trans-Ethiopian Visual Odyssey</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
              A Journey Across Six Worlds
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm max-w-xl leading-relaxed">
              From the Afro-alpine summits of Ras Dashen to the alien geothermal sulfur ponds of Danakil — scroll horizontally to travel through Ethiopia’s dramatic geological extremes.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-[#D4AF7A] bg-stone-900/90 border border-stone-800 px-4 py-2 rounded-full">
            <span>Scroll Down to Travel East & South</span>
            <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Horizontal Track / Slider */}
      <div className="w-full overflow-x-auto lg:overflow-visible no-scrollbar">
        <div
          ref={trackRef}
          className="flex gap-6 sm:gap-8 px-4 sm:px-6 lg:px-12 w-max items-stretch pb-6 lg:pb-0"
        >
          {journeyStops.map((stop) => (
            <div
              key={stop.id}
              className="w-[85vw] sm:w-[500px] lg:w-[600px] bg-stone-900/80 rounded-3xl overflow-hidden border border-stone-800 flex flex-col justify-between group hover:border-[#C88A2E]/60 transition-all duration-300 shadow-xl shrink-0"
            >
              {/* Card Image Area */}
              <div className="relative aspect-16/10 overflow-hidden bg-stone-950">
                <img
                  src={stop.image}
                  alt={stop.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/20 to-transparent" />

                {/* Step badge */}
                <div className="absolute top-4 left-4 bg-[#18181B]/90 backdrop-blur-xs border border-stone-700 text-[#D4AF7A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Stage {stop.step}
                </div>

                {/* Altitude Tag */}
                <div className="absolute top-4 right-4 bg-[#C88A2E] text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <Mountain className="w-3 h-3" />
                  <span>{stop.altitude}</span>
                </div>

                {/* Terrain banner */}
                <div className="absolute bottom-3 left-4 right-4 text-xs font-medium text-stone-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C88A2E]" />
                  <span>{stop.terrain}</span>
                </div>
              </div>

              {/* Card Content Area */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-[#D4AF7A] transition-colors">
                    {stop.title}
                  </h3>
                  <div className="text-xs font-semibold text-[#C88A2E] uppercase tracking-wider">
                    {stop.subtitle}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-400 leading-relaxed pt-1">
                    {stop.description}
                  </p>
                </div>

                {/* Key Highlights */}
                <div className="pt-2 border-t border-stone-800/80 space-y-1.5">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                    Expedition Highlights
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stop.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-stone-800 text-stone-300 px-2.5 py-1 rounded-md border border-stone-700"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4 flex items-center justify-between border-t border-stone-800">
                  <Link
                    to={stop.tourLink}
                    className="btn-gold px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2"
                  >
                    <span>View Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/destinations/${stop.id === 'addis' ? 'addis-ababa' : stop.id === 'simien' ? 'simien-mountains' : stop.id === 'danakil' ? 'danakil-depression' : stop.id === 'omo' ? 'omo-valley' : stop.id === 'bale' ? 'bale-mountains' : 'lalibela'}`}
                    className="text-xs text-stone-400 hover:text-white underline underline-offset-4"
                  >
                    Regional Guide
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
