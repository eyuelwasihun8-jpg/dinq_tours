import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Compass, Calendar, SlidersHorizontal } from 'lucide-react';
import destinationsData from '../../data/destinationsData';
import tourTypesData from '../../data/tourTypesData';

export default function TripFinder({ className = '', onFilterChange, initialValues }) {
  const navigate = useNavigate();
  const [destination, setDestination] = useState(initialValues?.destination || '');
  const [duration, setDuration] = useState(initialValues?.duration || '');
  const [category, setCategory] = useState(initialValues?.category || '');
  const [season, setSeason] = useState(initialValues?.season || '');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (duration) params.set('duration', duration);
    if (category) params.set('category', category);
    if (season) params.set('season', season);

    if (onFilterChange) {
      onFilterChange({ destination, duration, category, season });
    } else {
      navigate(`/tours?${params.toString()}`);
    }
  };

  const handleReset = () => {
    setDestination('');
    setDuration('');
    setCategory('');
    setSeason('');
    if (onFilterChange) {
      onFilterChange({ destination: '', duration: '', category: '', season: '' });
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-[#E7E1D7] p-4 sm:p-6 ${className}`}>
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Destination Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C88A2E]" />
              <span>Where in Ethiopia?</span>
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E7E1D7] rounded-xl px-3.5 py-2.5 text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
            >
              <option value="">All Destinations</option>
              {destinationsData.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C88A2E]" />
              <span>Trip Duration</span>
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E7E1D7] rounded-xl px-3.5 py-2.5 text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
            >
              <option value="">Any Duration</option>
              <option value="1-3">1 to 3 Days (Excursions)</option>
              <option value="4-7">4 to 7 Days (Highlights)</option>
              <option value="8-14">8 to 14 Days (In-Depth)</option>
              <option value="15+">15+ Days (Grand Expeditions)</option>
            </select>
          </div>

          {/* Experience Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#C88A2E]" />
              <span>Travel Style</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E7E1D7] rounded-xl px-3.5 py-2.5 text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
            >
              <option value="">All Travel Styles</option>
              {tourTypesData.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.shortTitle}
                </option>
              ))}
            </select>
          </div>

          {/* Season / Month */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C88A2E]" />
              <span>Travel Season</span>
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E7E1D7] rounded-xl px-3.5 py-2.5 text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#C88A2E]"
            >
              <option value="">Any Season</option>
              <option value="jan">January (Timkat & Genna Festivals)</option>
              <option value="dry">Oct - Mar (Peak Dry Season)</option>
              <option value="trek">Sep - Nov (Highland Flora & Wildflowers)</option>
              <option value="summer">Jun - Aug (Green Season & Low Crowds)</option>
            </select>
          </div>
        </div>

        {/* Action bar */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-500">
            Filtering across 15 authenticated Ethiopian journeys & safaris
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {(destination || duration || category || season) && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-stone-500 hover:text-stone-800 px-3 py-2"
              >
                Clear Filters
              </button>
            )}
            <button
              type="submit"
              className="btn-gold w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Find Matches</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
