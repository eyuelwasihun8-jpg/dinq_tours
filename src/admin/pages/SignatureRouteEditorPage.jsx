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
  slug: '',
  emoji: '',
  name: '',
  tagline: '',
  shortDesc: '',
  heroImage: '',
  stops: [''],
  themes: [''],
  duration: '',
  accent: 'stone',
  isBranded: false,
};

export default function SignatureRouteEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [route, setRoute] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      getDocById('signatureRoutes', id).then(data => {
        if (data) {
          setRoute({
            ...EMPTY,
            ...data,
            stops: data.stops?.length ? data.stops : [''],
            themes: data.themes?.length ? data.themes : [''],
          });
        }
        setLoading(false);
      });
    }
  }, [id]);

  const update = (field, value) => setRoute(r => ({ ...r, [field]: value }));
  const updateListItem = (field, i, value) => {
    const list = [...route[field]];
    list[i] = value;
    update(field, list);
  };
  const addListItem = (field) => update(field, [...route[field], '']);
  const removeListItem = (field, i) => update(field, route[field].filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!route.name.trim() || !route.slug.trim()) {
      toast.error('Name and slug required');
      return;
    }
    setSaving(true);
    try {
      const cleaned = {
        ...route,
        stops: route.stops.filter(s => s.trim()),
        themes: route.themes.filter(t => t.trim()),
      };
      if (isNew) {
        const newId = await createDoc('signatureRoutes', cleaned);
        toast.success('Route created');
        navigate(`/admin/signature-routes/${newId}/edit`);
      } else {
        await updateDocById('signatureRoutes', id, cleaned);
        toast.success('Route saved');
      }
    } catch (e) { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-16"><Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" /></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title={isNew ? 'New Signature Route' : `Edit: ${route.name}`}
        backTo="/admin/signature-routes"
        actions={<Button icon={Save} onClick={handleSave} loading={saving}>Save</Button>}
      />

      <div className="space-y-6">
        <Card title="Basic Info">
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <Input label="Emoji" value={route.emoji} onChange={e => update('emoji', e.target.value)} placeholder="🌋" />
              <div className="col-span-3">
                <Input label="Name" required value={route.name} onChange={e => update('name', e.target.value)} placeholder="Great Rift Valley Route" />
              </div>
            </div>
            <Input label="Slug" required value={route.slug} onChange={e => update('slug', e.target.value)} placeholder="great-rift-valley" />
            <Input label="Tagline" value={route.tagline} onChange={e => update('tagline', e.target.value)} placeholder="From Volcanoes to Southern Communities" />
            <Textarea label="Short Description" value={route.shortDesc} onChange={e => update('shortDesc', e.target.value)} rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Duration" value={route.duration} onChange={e => update('duration', e.target.value)} placeholder="10-14 Days" />
              <Input label="Accent Color" value={route.accent} onChange={e => update('accent', e.target.value)} placeholder="red, amber, stone..." />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={route.isBranded} onChange={e => update('isBranded', e.target.checked)} className="w-4 h-4 rounded border-stone-300 text-[#C88A2E] focus:ring-[#C88A2E]" />
              <span className="text-sm font-medium">⭐ Branded Exclusive Concept</span>
            </label>
          </div>
        </Card>

        <Card title="Hero Image">
          <UploadWidget label="" currentImage={route.heroImage} onUpload={url => update('heroImage', url)} />
        </Card>

        <Card title="Route Stops (In Order)">
          <div className="space-y-2">
            {route.stops.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="w-6 text-xs font-bold text-[#C88A2E]">#{i+1}</span>
                <input value={s} onChange={e => updateListItem('stops', i, e.target.value)} placeholder="e.g., Afar" className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]" />
                <button onClick={() => removeListItem('stops', i)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={() => addListItem('stops')}>Add Stop</Button>
          </div>
        </Card>

        <Card title="Themes">
          <div className="space-y-2">
            {route.themes.map((t, i) => (
              <div key={i} className="flex gap-2">
                <input value={t} onChange={e => updateListItem('themes', i, e.target.value)} placeholder="e.g., Volcanoes" className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]" />
                <button onClick={() => removeListItem('themes', i)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={() => addListItem('themes')}>Add Theme</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}