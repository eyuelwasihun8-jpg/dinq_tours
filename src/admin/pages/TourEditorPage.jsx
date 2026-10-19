import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, Calendar, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDocById, createDoc, updateDocById } from '../../firebase/firestore';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import UploadWidget from '../../cloudinary/UploadWidget';
import GalleryUploadWidget from '../../cloudinary/GalleryUploadWidget';

const EMPTY_TOUR = {
  slug: '',
  title: '',
  shortTitle: '',
  tagline: '',
  destination: '',
  destinationSlug: '',
  category: '',
  categorySlug: '',
  durationDays: 7,
  durationNights: 6,
  difficulty: 'Moderate',
  physicalRating: '',
  priceFromETB: '',
  priceFromUSD: '',
  groupSize: '2 - 12 Travelers',
  season: '',
  rating: 4.9,
  reviewCount: 0,
  isFeatured: false,
  isUpcoming: false,
  heroImage: '',
  gallery: [],
  overview: '',
  highlights: [''],
  itinerary: [
    { day: 1, title: '', morning: '', afternoon: '', evening: '', meals: '', accommodation: '' }
  ],
  inclusions: [''],
  exclusions: [''],
  facts: {
    transportation: '',
    accommodation: '',
    elevation: '',
    bestSeason: '',
    language: 'English, Amharic',
  },
  upcomingDates: [],
};

export default function TourEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id;

  const [tour, setTour] = useState(EMPTY_TOUR);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      loadTour();
    }
  }, [id]);

  const loadTour = async () => {
    try {
      const data = await getDocById('tours', id);
      if (data) {
        // Fill in any missing fields with defaults
        setTour({ ...EMPTY_TOUR, ...data });
      } else {
        toast.error('Tour not found');
        navigate('/admin/tours');
      }
    } catch (error) {
      toast.error('Failed to load tour');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setTour((t) => ({ ...t, [field]: value }));
  };

  const updateFact = (field, value) => {
    setTour((t) => ({ ...t, facts: { ...t.facts, [field]: value } }));
  };

  // ========== LIST FIELDS (highlights, inclusions, exclusions) ==========
  const updateListItem = (field, index, value) => {
    const list = [...tour[field]];
    list[index] = value;
    updateField(field, list);
  };

  const addListItem = (field) => {
    updateField(field, [...tour[field], '']);
  };

  const removeListItem = (field, index) => {
    updateField(field, tour[field].filter((_, i) => i !== index));
  };

  // ========== ITINERARY ==========
  const updateItineraryDay = (index, field, value) => {
    const itinerary = [...tour.itinerary];
    itinerary[index] = { ...itinerary[index], [field]: value };
    updateField('itinerary', itinerary);
  };

  const addItineraryDay = () => {
    const newDay = {
      day: tour.itinerary.length + 1,
      title: '',
      morning: '',
      afternoon: '',
      evening: '',
      meals: '',
      accommodation: '',
    };
    updateField('itinerary', [...tour.itinerary, newDay]);
  };

  const removeItineraryDay = (index) => {
    if (tour.itinerary.length === 1) {
      toast.error('Tour must have at least one day');
      return;
    }
    const itinerary = tour.itinerary.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }));
    updateField('itinerary', itinerary);
  };

  const moveItineraryDay = (index, direction) => {
    const itinerary = [...tour.itinerary];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= itinerary.length) return;
    [itinerary[index], itinerary[newIndex]] = [itinerary[newIndex], itinerary[index]];
    const renumbered = itinerary.map((d, i) => ({ ...d, day: i + 1 }));
    updateField('itinerary', renumbered);
  };

  // ========== UPCOMING DATES ==========
  const addUpcomingDate = () => {
    updateField('upcomingDates', [
      ...tour.upcomingDates,
      { dates: '', spotsLeft: 6, status: 'Open' }
    ]);
  };

  const updateUpcomingDate = (index, field, value) => {
    const dates = [...tour.upcomingDates];
    dates[index] = { ...dates[index], [field]: value };
    updateField('upcomingDates', dates);
  };

  const removeUpcomingDate = (index) => {
    updateField('upcomingDates', tour.upcomingDates.filter((_, i) => i !== index));
  };

  // ========== SAVE ==========
  const handleSave = async () => {
    // Validate
    if (!tour.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!tour.slug.trim()) {
      toast.error('Slug is required');
      return;
    }

    setSaving(true);
    try {
      // Clean empty strings from lists
      const cleaned = {
        ...tour,
        highlights: tour.highlights.filter(h => h.trim()),
        inclusions: tour.inclusions.filter(i => i.trim()),
        exclusions: tour.exclusions.filter(e => e.trim()),
      };

      if (isNew) {
        const newId = await createDoc('tours', cleaned);
        toast.success('Tour created successfully!');
        navigate(`/admin/tours/${newId}/edit`);
      } else {
        await updateDocById('tours', id, cleaned);
        toast.success('Tour updated successfully!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save tour');
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = () => {
    const slug = tour.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    updateField('slug', slug);
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" />
        <p className="text-sm text-stone-500 mt-3">Loading tour...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title={isNew ? 'Add New Tour' : `Edit: ${tour.title}`}
        subtitle={isNew ? 'Create a new tour expedition' : 'Modify tour details and itinerary'}
        backTo="/admin/tours"
        actions={
          <Button variant="primary" icon={Save} onClick={handleSave} loading={saving}>
            {isNew ? 'Create Tour' : 'Save Changes'}
          </Button>
        }
      />

      <div className="space-y-6">
        {/* BASIC INFO */}
        <Card title="Basic Information" description="Primary identification and metadata">
          <div className="space-y-4">
            <Input
              label="Tour Title"
              required
              value={tour.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g., Danakil Depression & Erta Ale Volcano Expedition"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="URL Slug"
                  required
                  value={tour.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  placeholder="danakil-depression-erta-ale"
                  hint="Lowercase, hyphens only. This is the URL."
                />
                <button type="button" onClick={generateSlug} className="text-xs text-[#C88A2E] font-semibold hover:underline mt-1">
                  Generate from title
                </button>
              </div>

              <Input
                label="Short Title"
                value={tour.shortTitle}
                onChange={(e) => updateField('shortTitle', e.target.value)}
                placeholder="Danakil & Erta Ale"
              />
            </div>

            <Textarea
              label="Tagline"
              value={tour.tagline}
              onChange={(e) => updateField('tagline', e.target.value)}
              placeholder="One-line hook that captures the spirit of this tour"
              rows={2}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Destination"
                value={tour.destination}
                onChange={(e) => updateField('destination', e.target.value)}
                placeholder="Danakil Depression"
              />
              <Input
                label="Destination Slug"
                value={tour.destinationSlug}
                onChange={(e) => updateField('destinationSlug', e.target.value)}
                placeholder="danakil-depression"
                hint="For linking to destinations page"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Category"
                value={tour.category}
                onChange={(e) => updateField('category', e.target.value)}
                placeholder="Nature & Adventure Tours"
              />
              <Input
                label="Category Slug"
                value={tour.categorySlug}
                onChange={(e) => updateField('categorySlug', e.target.value)}
                placeholder="trekking-hiking"
              />
            </div>
          </div>
        </Card>

        {/* IMAGES */}
        <Card title="Images" description="Hero image appears on tour card. Gallery shows on tour detail page.">
          <div className="space-y-5">
            <UploadWidget
              label="Hero Image (Main Card Image)"
              currentImage={tour.heroImage}
              onUpload={(url) => updateField('heroImage', url)}
            />

            <GalleryUploadWidget
              label="Tour Gallery"
              images={tour.gallery}
              onChange={(urls) => updateField('gallery', urls)}
            />
          </div>
        </Card>

        {/* PRICING & DETAILS */}
        <Card title="Pricing & Trip Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Duration (Days)"
              type="number"
              value={tour.durationDays}
              onChange={(e) => updateField('durationDays', parseInt(e.target.value) || 0)}
            />
            <Input
              label="Duration (Nights)"
              type="number"
              value={tour.durationNights}
              onChange={(e) => updateField('durationNights', parseInt(e.target.value) || 0)}
            />
            <Input
              label="Price USD"
              value={tour.priceFromUSD}
              onChange={(e) => updateField('priceFromUSD', e.target.value)}
              placeholder="$650 USD"
            />
            <Input
              label="Price ETB"
              value={tour.priceFromETB}
              onChange={(e) => updateField('priceFromETB', e.target.value)}
              placeholder="35,000 ETB"
            />
            <Input
              label="Group Size"
              value={tour.groupSize}
              onChange={(e) => updateField('groupSize', e.target.value)}
              placeholder="4 - 12 Travelers"
            />
            <Select
              label="Difficulty"
              value={tour.difficulty}
              onChange={(e) => updateField('difficulty', e.target.value)}
              options={[
                { value: 'Easy', label: 'Easy' },
                { value: 'Easy to Moderate', label: 'Easy to Moderate' },
                { value: 'Moderate', label: 'Moderate' },
                { value: 'Moderate to Challenging', label: 'Moderate to Challenging' },
                { value: 'Challenging', label: 'Challenging' },
                { value: 'Strenuous Expedition', label: 'Strenuous Expedition' },
              ]}
            />
            <Input
              label="Physical Rating"
              value={tour.physicalRating}
              onChange={(e) => updateField('physicalRating', e.target.value)}
              placeholder="High heat exposure & summit night trek"
            />
            <Input
              label="Best Season"
              value={tour.season}
              onChange={(e) => updateField('season', e.target.value)}
              placeholder="October to April"
            />
            <Input
              label="Rating (1-5)"
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={tour.rating}
              onChange={(e) => updateField('rating', parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Review Count"
              type="number"
              value={tour.reviewCount}
              onChange={(e) => updateField('reviewCount', parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="mt-4 flex items-center gap-6 pt-4 border-t border-stone-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tour.isFeatured}
                onChange={(e) => updateField('isFeatured', e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-[#C88A2E] focus:ring-[#C88A2E]"
              />
              <span className="text-sm font-medium text-stone-700">⭐ Featured on Homepage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tour.isUpcoming}
                onChange={(e) => updateField('isUpcoming', e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-[#C88A2E] focus:ring-[#C88A2E]"
              />
              <span className="text-sm font-medium text-stone-700">📅 Show in Upcoming Departures</span>
            </label>
          </div>
        </Card>

        {/* OVERVIEW */}
        <Card title="Tour Overview" description="Full description shown on the tour detail page">
          <Textarea
            value={tour.overview}
            onChange={(e) => updateField('overview', e.target.value)}
            rows={8}
            placeholder="Write a rich, detailed description of what the traveler will experience..."
          />
        </Card>

        {/* HIGHLIGHTS */}
        <Card title="Key Highlights" description="Top 5-8 highlights of this tour">
          <div className="space-y-2">
            {tour.highlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={h}
                  onChange={(e) => updateListItem('highlights', i, e.target.value)}
                  placeholder={`Highlight #${i + 1}`}
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]"
                />
                <button
                  type="button"
                  onClick={() => removeListItem('highlights', i)}
                  className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={() => addListItem('highlights')}>
              Add Highlight
            </Button>
          </div>
        </Card>

        {/* ITINERARY BUILDER */}
        <Card title="Day-by-Day Itinerary" description="Build the complete journey with daily programs">
          <div className="space-y-4">
            {tour.itinerary.map((day, i) => (
              <div key={i} className="p-5 border-2 border-stone-200 rounded-2xl bg-stone-50 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h4 className="font-serif text-lg font-bold text-stone-900">
                    Day {day.day}
                  </h4>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveItineraryDay(i, -1)}
                      disabled={i === 0}
                      className="p-1.5 text-stone-500 hover:text-[#C88A2E] disabled:opacity-30 disabled:cursor-not-allowed rounded"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItineraryDay(i, 1)}
                      disabled={i === tour.itinerary.length - 1}
                      className="p-1.5 text-stone-500 hover:text-[#C88A2E] disabled:opacity-30 disabled:cursor-not-allowed rounded"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItineraryDay(i)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <Input
                  label="Day Title"
                  value={day.title}
                  onChange={(e) => updateItineraryDay(i, 'title', e.target.value)}
                  placeholder="e.g., Flight Addis Ababa to Semera — Desert Drive to Erta Ale"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Textarea
                    label="Morning"
                    value={day.morning}
                    onChange={(e) => updateItineraryDay(i, 'morning', e.target.value)}
                    rows={3}
                  />
                  <Textarea
                    label="Afternoon"
                    value={day.afternoon}
                    onChange={(e) => updateItineraryDay(i, 'afternoon', e.target.value)}
                    rows={3}
                  />
                  <Textarea
                    label="Evening"
                    value={day.evening}
                    onChange={(e) => updateItineraryDay(i, 'evening', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Meals Included"
                    value={day.meals}
                    onChange={(e) => updateItineraryDay(i, 'meals', e.target.value)}
                    placeholder="Lunch, Dinner, Bottled Water"
                  />
                  <Input
                    label="Accommodation"
                    value={day.accommodation}
                    onChange={(e) => updateItineraryDay(i, 'accommodation', e.target.value)}
                    placeholder="Erta Ale Summit Camp (Tents)"
                  />
                </div>
              </div>
            ))}

            <Button variant="outline" icon={Plus} onClick={addItineraryDay}>
              Add Another Day
            </Button>
          </div>
        </Card>

        {/* INCLUSIONS */}
        <Card title="What's Included" description="Everything covered in the tour price">
          <div className="space-y-2">
            {tour.inclusions.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem('inclusions', i, e.target.value)}
                  placeholder="e.g., All ground transportation in 4WD Toyota Land Cruiser"
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]"
                />
                <button type="button" onClick={() => removeListItem('inclusions', i)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={() => addListItem('inclusions')}>
              Add Inclusion
            </Button>
          </div>
        </Card>

        {/* EXCLUSIONS */}
        <Card title="What's NOT Included" description="Things the traveler is responsible for">
          <div className="space-y-2">
            {tour.exclusions.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem('exclusions', i, e.target.value)}
                  placeholder="e.g., International flights, personal travel insurance"
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]"
                />
                <button type="button" onClick={() => removeListItem('exclusions', i)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={() => addListItem('exclusions')}>
              Add Exclusion
            </Button>
          </div>
        </Card>

        {/* FACTS */}
        <Card title="Quick Facts" description="Appears in the sidebar on tour detail page">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Transportation" value={tour.facts?.transportation || ''} onChange={(e) => updateFact('transportation', e.target.value)} placeholder="4WD Toyota Land Cruiser A/C" />
            <Input label="Accommodation Type" value={tour.facts?.accommodation || ''} onChange={(e) => updateFact('accommodation', e.target.value)} placeholder="Heritage Eco-Lodges" />
            <Input label="Elevation" value={tour.facts?.elevation || ''} onChange={(e) => updateFact('elevation', e.target.value)} placeholder="1,800m – 3,200m" />
            <Input label="Best Season" value={tour.facts?.bestSeason || ''} onChange={(e) => updateFact('bestSeason', e.target.value)} placeholder="October to April" />
            <Input label="Guiding Languages" value={tour.facts?.language || ''} onChange={(e) => updateFact('language', e.target.value)} placeholder="English, Amharic, French" />
          </div>
        </Card>

        {/* UPCOMING DATES */}
        <Card title="Upcoming Departure Dates" description="Guaranteed group departures (shows in upcoming section)">
          <div className="space-y-3">
            {tour.upcomingDates.map((date, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="sm:col-span-5">
                  <Input
                    label="Dates"
                    value={date.dates}
                    onChange={(e) => updateUpcomingDate(i, 'dates', e.target.value)}
                    placeholder="Oct 15 - 18, 2025"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Spots Left"
                    type="number"
                    value={date.spotsLeft}
                    onChange={(e) => updateUpcomingDate(i, 'spotsLeft', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="sm:col-span-4">
                  <Select
                    label="Status"
                    value={date.status}
                    onChange={(e) => updateUpcomingDate(i, 'status', e.target.value)}
                    options={[
                      { value: 'Open', label: 'Open' },
                      { value: 'Guaranteed Departure', label: 'Guaranteed Departure' },
                      { value: 'Almost Full', label: 'Almost Full' },
                      { value: 'Peak Season', label: 'Peak Season' },
                      { value: 'Sold Out', label: 'Sold Out' },
                      { value: 'Timkat Special', label: 'Timkat Special' },
                    ]}
                  />
                </div>
                <div className="sm:col-span-1">
                  <button type="button" onClick={() => removeUpcomingDate(i)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl w-full flex justify-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <Button variant="outline" icon={Calendar} onClick={addUpcomingDate}>
              Add Departure Date
            </Button>
          </div>
        </Card>

        {/* FINAL SAVE */}
        <div className="sticky bottom-4 flex justify-end bg-white p-4 rounded-2xl shadow-xl border border-stone-200">
          <Button variant="primary" icon={Save} onClick={handleSave} loading={saving} size="large">
            {isNew ? 'Create Tour' : 'Save All Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}