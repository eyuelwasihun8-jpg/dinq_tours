import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Plus, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDocById, createDoc, updateDocById } from '../../firebase/firestore';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import UploadWidget from '../../cloudinary/UploadWidget';
import GalleryUploadWidget from '../../cloudinary/GalleryUploadWidget';

const EMPTY = {
  slug: '',
  name: '',
  region: '',
  tagline: '',
  altitude: '',
  heroImage: '',
  gallery: [],
  overview: '',
  history: '',
  highlights: [''],
  bestTimeToVisit: '',
  howToReach: '',
  practicalTips: [''],
  faqs: [{ q: '', a: '' }],
  relatedTourSlugs: [''],
};

export default function DestinationEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [dest, setDest] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      getDocById('destinations', id).then(data => {
        if (data) {
          setDest({ 
            ...EMPTY, 
            ...data,
            highlights: data.highlights?.length ? data.highlights : [''],
            practicalTips: data.practicalTips?.length ? data.practicalTips : [''],
            faqs: data.faqs?.length ? data.faqs : [{ q: '', a: '' }],
            relatedTourSlugs: data.relatedTourSlugs?.length ? data.relatedTourSlugs : [''],
            gallery: data.gallery || [],
          });
        }
        setLoading(false);
      });
    }
  }, [id]);

  const update = (field, value) => setDest(d => ({ ...d, [field]: value }));

  const updateListItem = (field, i, value) => {
    const list = [...dest[field]];
    list[i] = value;
    update(field, list);
  };
  const addListItem = (field) => update(field, [...dest[field], '']);
  const removeListItem = (field, i) => update(field, dest[field].filter((_, idx) => idx !== i));

  const updateFaq = (i, field, value) => {
    const faqs = [...dest.faqs];
    faqs[i] = { ...faqs[i], [field]: value };
    update('faqs', faqs);
  };
  const addFaq = () => update('faqs', [...dest.faqs, { q: '', a: '' }]);
  const removeFaq = (i) => update('faqs', dest.faqs.filter((_, idx) => idx !== i));

  const generateSlug = () => {
    update('slug', dest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  };

  const handleSave = async () => {
    if (!dest.name.trim() || !dest.slug.trim()) {
      toast.error('Name and slug required');
      return;
    }
    setSaving(true);
    try {
      const cleaned = {
        ...dest,
        highlights: dest.highlights.filter(h => h.trim()),
        practicalTips: dest.practicalTips.filter(t => t.trim()),
        faqs: dest.faqs.filter(f => f.q.trim() && f.a.trim()),
        relatedTourSlugs: dest.relatedTourSlugs.filter(s => s.trim()),
      };

      if (isNew) {
        const newId = await createDoc('destinations', cleaned);
        toast.success('Destination created');
        navigate(`/admin/destinations/${newId}/edit`);
      } else {
        await updateDocById('destinations', id, cleaned);
        toast.success('Destination saved');
      }
    } catch (e) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-16"><Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title={isNew ? 'New Destination' : `Edit: ${dest.name}`}
        backTo="/admin/destinations"
        actions={<Button icon={Save} onClick={handleSave} loading={saving}>Save</Button>}
      />

      <div className="space-y-6">
        <Card title="Basic Info">
          <div className="space-y-4">
            <Input label="Name" required value={dest.name} onChange={e => update('name', e.target.value)} placeholder="Lalibela & The Lasta Mountains" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input label="URL Slug" required value={dest.slug} onChange={e => update('slug', e.target.value)} />
                <button onClick={generateSlug} type="button" className="text-xs text-[#C88A2E] font-semibold hover:underline mt-1">Generate from name</button>
              </div>
              <Input label="Region" value={dest.region} onChange={e => update('region', e.target.value)} placeholder="Amhara Region, Northern Ethiopia" />
            </div>
            <Input label="Altitude" value={dest.altitude} onChange={e => update('altitude', e.target.value)} placeholder="2,600m (8,530 ft)" />
            <Textarea label="Tagline" value={dest.tagline} onChange={e => update('tagline', e.target.value)} rows={2} />
          </div>
        </Card>

        <Card title="Images">
          <div className="space-y-5">
            <UploadWidget label="Hero Image" currentImage={dest.heroImage} onUpload={url => update('heroImage', url)} />
            <GalleryUploadWidget label="Image Gallery" images={dest.gallery} onChange={urls => update('gallery', urls)} />
          </div>
        </Card>

        <Card title="Rich Content">
          <div className="space-y-4">
            <Textarea label="Overview" value={dest.overview} onChange={e => update('overview', e.target.value)} rows={6} />
            <Textarea label="Historical Context" value={dest.history} onChange={e => update('history', e.target.value)} rows={3} />
            <Input label="Best Time to Visit" value={dest.bestTimeToVisit} onChange={e => update('bestTimeToVisit', e.target.value)} />
            <Input label="How to Reach" value={dest.howToReach} onChange={e => update('howToReach', e.target.value)} />
          </div>
        </Card>

        <Card title="Highlights">
          <div className="space-y-2">
            {dest.highlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <input value={h} onChange={e => updateListItem('highlights', i, e.target.value)} placeholder={`Highlight #${i+1}`} className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]" />
                <button onClick={() => removeListItem('highlights', i)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={() => addListItem('highlights')}>Add Highlight</Button>
          </div>
        </Card>

        <Card title="Practical Travel Tips">
          <div className="space-y-2">
            {dest.practicalTips.map((t, i) => (
              <div key={i} className="flex gap-2">
                <input value={t} onChange={e => updateListItem('practicalTips', i, e.target.value)} placeholder={`Tip #${i+1}`} className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]" />
                <button onClick={() => removeListItem('practicalTips', i)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={() => addListItem('practicalTips')}>Add Tip</Button>
          </div>
        </Card>

        <Card title="Frequently Asked Questions">
          <div className="space-y-4">
            {dest.faqs.map((faq, i) => (
              <div key={i} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-600 uppercase">FAQ #{i+1}</span>
                  <button onClick={() => removeFaq(i)} className="p-1.5 text-rose-500 hover:bg-rose-100 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <Input label="Question" value={faq.q} onChange={e => updateFaq(i, 'q', e.target.value)} />
                <Textarea label="Answer" value={faq.a} onChange={e => updateFaq(i, 'a', e.target.value)} rows={3} />
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={addFaq}>Add FAQ</Button>
          </div>
        </Card>

        <Card title="Related Tours" description="Enter tour slugs that are related to this destination">
          <div className="space-y-2">
            {dest.relatedTourSlugs.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input value={s} onChange={e => updateListItem('relatedTourSlugs', i, e.target.value)} placeholder="e.g., simien-mountains-trekking-ras-dashen" className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]" />
                <button onClick={() => removeListItem('relatedTourSlugs', i)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={() => addListItem('relatedTourSlugs')}>Add Related Tour</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}