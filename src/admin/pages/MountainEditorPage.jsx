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

const EMPTY = {
  number: '',
  slug: '',
  name: '',
  tagline: '',
  signature: '',
  altitude: '',
  region: '',
  description: '',
  heroImage: '',
  experiences: [''],
  relatedTourSlug: '',
  unesco: false,
  featured: false,
  subTagline: '',
};

export default function MountainEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [mt, setMt] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      getDocById('mountains', id).then(data => {
        if (data) {
          setMt({ ...EMPTY, ...data, experiences: data.experiences?.length ? data.experiences : [''] });
        }
        setLoading(false);
      });
    }
  }, [id]);

  const update = (field, value) => setMt(m => ({ ...m, [field]: value }));
  const updateExp = (i, value) => {
    const exps = [...mt.experiences];
    exps[i] = value;
    update('experiences', exps);
  };
  const addExp = () => update('experiences', [...mt.experiences, '']);
  const removeExp = (i) => update('experiences', mt.experiences.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!mt.name.trim() || !mt.slug.trim()) {
      toast.error('Name and slug required');
      return;
    }
    setSaving(true);
    try {
      const cleaned = { ...mt, experiences: mt.experiences.filter(e => e.trim()) };
      if (isNew) {
        const newId = await createDoc('mountains', cleaned);
        toast.success('Mountain created');
        navigate(`/admin/mountains/${newId}/edit`);
      } else {
        await updateDocById('mountains', id, cleaned);
        toast.success('Mountain saved');
      }
    } catch (e) { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-16"><Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" /></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title={isNew ? 'New Mountain' : `Edit: ${mt.name}`}
        backTo="/admin/mountains"
        actions={<Button icon={Save} onClick={handleSave} loading={saving}>Save</Button>}
      />

      <div className="space-y-6">
        <Card title="Basic Info">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Input label="Number" value={mt.number} onChange={e => update('number', e.target.value)} placeholder="01" />
              <Input label="Slug" required value={mt.slug} onChange={e => update('slug', e.target.value)} placeholder="simien" />
              <Input label="Altitude" value={mt.altitude} onChange={e => update('altitude', e.target.value)} placeholder="4,543m" />
            </div>
            <Input label="Name" required value={mt.name} onChange={e => update('name', e.target.value)} placeholder="Simien Mountains" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Tagline" value={mt.tagline} onChange={e => update('tagline', e.target.value)} placeholder="Cliffs • Peaks • Wildlife" />
              <Input label="Region" value={mt.region} onChange={e => update('region', e.target.value)} placeholder="Amhara" />
            </div>
            <Input label="Signature Name" value={mt.signature} onChange={e => update('signature', e.target.value)} placeholder="The Roof of Ethiopia" />
            <Input label="Sub-Tagline (Optional)" value={mt.subTagline} onChange={e => update('subTagline', e.target.value)} placeholder="Climb the Mountain..." />
            <Textarea label="Description" value={mt.description} onChange={e => update('description', e.target.value)} rows={4} />
            <Input label="Related Tour Slug" value={mt.relatedTourSlug} onChange={e => update('relatedTourSlug', e.target.value)} placeholder="simien-mountains-trekking" />
            
            <div className="flex items-center gap-6 pt-2 border-t border-stone-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={mt.unesco} onChange={e => update('unesco', e.target.checked)} className="w-4 h-4 rounded border-stone-300 text-[#C88A2E]" />
                <span className="text-sm font-medium">🏛️ UNESCO Site</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={mt.featured} onChange={e => update('featured', e.target.checked)} className="w-4 h-4 rounded border-stone-300 text-[#C88A2E]" />
                <span className="text-sm font-medium">⭐ Featured</span>
              </label>
            </div>
          </div>
        </Card>

        <Card title="Hero Image">
          <UploadWidget label="" currentImage={mt.heroImage} onUpload={url => update('heroImage', url)} />
        </Card>

        <Card title="Experiences & Activities">
          <div className="space-y-2">
            {mt.experiences.map((e, i) => (
              <div key={i} className="flex gap-2">
                <input value={e} onChange={ev => updateExp(i, ev.target.value)} placeholder="e.g., Trekking" className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]" />
                <button onClick={() => removeExp(i)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={addExp}>Add Experience</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}