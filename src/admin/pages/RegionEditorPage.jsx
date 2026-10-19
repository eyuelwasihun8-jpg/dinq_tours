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
  shortDesc: '',
  signature: '',
  heroImage: '',
  discover: [''],
  pillars: [{ icon: '', title: '', desc: '' }],
  relatedTourSlugs: [''],
  relatedDestinationSlugs: [''],
  color: 'from-stone-800 to-stone-950',
};

export default function RegionEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [reg, setReg] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      getDocById('regions', id).then(data => {
        if (data) {
          setReg({
            ...EMPTY,
            ...data,
            discover: data.discover?.length ? data.discover : [''],
            pillars: data.pillars?.length ? data.pillars : [{ icon: '', title: '', desc: '' }],
            relatedTourSlugs: data.relatedTourSlugs?.length ? data.relatedTourSlugs : [''],
            relatedDestinationSlugs: data.relatedDestinationSlugs?.length ? data.relatedDestinationSlugs : [''],
          });
        }
        setLoading(false);
      });
    }
  }, [id]);

  const update = (field, value) => setReg(r => ({ ...r, [field]: value }));

  const updateListItem = (field, i, value) => {
    const list = [...reg[field]];
    list[i] = value;
    update(field, list);
  };
  const addListItem = (field) => update(field, [...reg[field], '']);
  const removeListItem = (field, i) => update(field, reg[field].filter((_, idx) => idx !== i));

  const updatePillar = (i, field, value) => {
    const pillars = [...reg.pillars];
    pillars[i] = { ...pillars[i], [field]: value };
    update('pillars', pillars);
  };
  const addPillar = () => update('pillars', [...reg.pillars, { icon: '', title: '', desc: '' }]);
  const removePillar = (i) => update('pillars', reg.pillars.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!reg.name.trim() || !reg.slug.trim()) {
      toast.error('Name and slug required');
      return;
    }
    setSaving(true);
    try {
      const cleaned = {
        ...reg,
        discover: reg.discover.filter(d => d.trim()),
        pillars: reg.pillars.filter(p => p.title.trim()),
        relatedTourSlugs: reg.relatedTourSlugs.filter(s => s.trim()),
        relatedDestinationSlugs: reg.relatedDestinationSlugs.filter(s => s.trim()),
      };

      if (isNew) {
        const newId = await createDoc('regions', cleaned);
        toast.success('Region created');
        navigate(`/admin/regions/${newId}/edit`);
      } else {
        await updateDocById('regions', id, cleaned);
        toast.success('Region saved');
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
        title={isNew ? 'New Region' : `Edit: ${reg.name}`}
        backTo="/admin/regions"
        actions={<Button icon={Save} onClick={handleSave} loading={saving}>Save</Button>}
      />

      <div className="space-y-6">
        <Card title="Basic Info">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Input label="Number" value={reg.number} onChange={e => update('number', e.target.value)} placeholder="01" />
              <Input label="Slug" required value={reg.slug} onChange={e => update('slug', e.target.value)} placeholder="north" />
              <Input label="Signature" value={reg.signature} onChange={e => update('signature', e.target.value)} placeholder="The Historic North" />
            </div>
            <Input label="Name" required value={reg.name} onChange={e => update('name', e.target.value)} placeholder="North Ethiopia" />
            <Input label="Tagline" value={reg.tagline} onChange={e => update('tagline', e.target.value)} placeholder="History • Heritage • Ancient Civilizations" />
            <Textarea label="Short Description" value={reg.shortDesc} onChange={e => update('shortDesc', e.target.value)} rows={3} />
          </div>
        </Card>

        <Card title="Hero Image">
          <UploadWidget label="" currentImage={reg.heroImage} onUpload={url => update('heroImage', url)} />
        </Card>

        <Card title="Discover Tags" description="Short list of what travelers will discover">
          <div className="space-y-2">
            {reg.discover.map((d, i) => (
              <div key={i} className="flex gap-2">
                <input value={d} onChange={e => updateListItem('discover', i, e.target.value)} placeholder="e.g., Lalibela" className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]" />
                <button onClick={() => removeListItem('discover', i)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={() => addListItem('discover')}>Add Tag</Button>
          </div>
        </Card>

        <Card title="Three Pillars" description="Key themes for this region (3 recommended)">
          <div className="space-y-4">
            {reg.pillars.map((p, i) => (
              <div key={i} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-600 uppercase">Pillar #{i+1}</span>
                  <button onClick={() => removePillar(i)} className="p-1.5 text-rose-500 hover:bg-rose-100 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Input label="Icon (Emoji)" value={p.icon} onChange={e => updatePillar(i, 'icon', e.target.value)} placeholder="⛪" />
                  <div className="col-span-2">
                    <Input label="Title" value={p.title} onChange={e => updatePillar(i, 'title', e.target.value)} placeholder="Sacred Heritage" />
                  </div>
                </div>
                <Textarea label="Description" value={p.desc} onChange={e => updatePillar(i, 'desc', e.target.value)} rows={2} />
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={addPillar}>Add Pillar</Button>
          </div>
        </Card>

        <Card title="Related Tours">
          <div className="space-y-2">
            {reg.relatedTourSlugs.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input value={s} onChange={e => updateListItem('relatedTourSlugs', i, e.target.value)} placeholder="tour-slug" className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]" />
                <button onClick={() => removeListItem('relatedTourSlugs', i)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={() => addListItem('relatedTourSlugs')}>Add Tour Slug</Button>
          </div>
        </Card>

        <Card title="Related Destinations">
          <div className="space-y-2">
            {reg.relatedDestinationSlugs.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input value={s} onChange={e => updateListItem('relatedDestinationSlugs', i, e.target.value)} placeholder="destination-slug" className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]" />
                <button onClick={() => removeListItem('relatedDestinationSlugs', i)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={() => addListItem('relatedDestinationSlugs')}>Add Destination Slug</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}