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
  title: '',
  shortTitle: '',
  tagline: '',
  category: '',
  duration: '',
  location: '',
  heroImage: '',
  summary: '',
  narrative: '',
  highlights: [''],
  program: [''],
  signature: '',
  relatedTourSlugs: [''],
};

export default function ExperienceEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [exp, setExp] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      getDocById('experiences', id).then(data => {
        if (data) {
          setExp({
            ...EMPTY,
            ...data,
            highlights: data.highlights?.length ? data.highlights : [''],
            program: data.program?.length ? data.program : [''],
            relatedTourSlugs: data.relatedTourSlugs?.length ? data.relatedTourSlugs : [''],
          });
        }
        setLoading(false);
      });
    }
  }, [id]);

  const update = (field, value) => setExp(e => ({ ...e, [field]: value }));
  const updateListItem = (field, i, value) => {
    const list = [...exp[field]];
    list[i] = value;
    update(field, list);
  };
  const addListItem = (field) => update(field, [...exp[field], '']);
  const removeListItem = (field, i) => update(field, exp[field].filter((_, idx) => idx !== i));

  const generateSlug = () => {
    update('slug', exp.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  };

  const handleSave = async () => {
    if (!exp.title.trim() || !exp.slug.trim()) {
      toast.error('Title and slug required');
      return;
    }
    setSaving(true);
    try {
      const cleaned = {
        ...exp,
        highlights: exp.highlights.filter(h => h.trim()),
        program: exp.program.filter(p => p.trim()),
        relatedTourSlugs: exp.relatedTourSlugs.filter(s => s.trim()),
      };
      if (isNew) {
        const newId = await createDoc('experiences', cleaned);
        toast.success('Created');
        navigate(`/admin/experiences/${newId}/edit`);
      } else {
        await updateDocById('experiences', id, cleaned);
        toast.success('Saved');
      }
    } catch (e) { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-16"><Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" /></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title={isNew ? 'New Experience' : `Edit: ${exp.title}`}
        backTo="/admin/experiences"
        actions={<Button icon={Save} onClick={handleSave} loading={saving}>Save</Button>}
      />

      <div className="space-y-6">
        <Card title="Basic Info">
          <div className="space-y-4">
            <Input label="Title" required value={exp.title} onChange={e => update('title', e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input label="Slug" required value={exp.slug} onChange={e => update('slug', e.target.value)} />
                <button type="button" onClick={generateSlug} className="text-xs text-[#C88A2E] font-semibold hover:underline mt-1">Generate</button>
              </div>
              <Input label="Short Title" value={exp.shortTitle} onChange={e => update('shortTitle', e.target.value)} />
            </div>
            <Textarea label="Tagline" value={exp.tagline} onChange={e => update('tagline', e.target.value)} rows={2} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Category" value={exp.category} onChange={e => update('category', e.target.value)} placeholder="Living Culture" />
              <Input label="Duration" value={exp.duration} onChange={e => update('duration', e.target.value)} placeholder="2-3 Hours" />
              <Input label="Location" value={exp.location} onChange={e => update('location', e.target.value)} placeholder="Across Ethiopia" />
            </div>
            <Input label="Signature Name" value={exp.signature} onChange={e => update('signature', e.target.value)} placeholder="Travel as a Guest. Leave as a Friend." />
          </div>
        </Card>

        <Card title="Hero Image">
          <UploadWidget label="" currentImage={exp.heroImage} onUpload={url => update('heroImage', url)} />
        </Card>

        <Card title="Content">
          <div className="space-y-4">
            <Textarea label="Summary (Short Hook)" value={exp.summary} onChange={e => update('summary', e.target.value)} rows={2} />
            <Textarea label="Narrative (Full Description)" value={exp.narrative} onChange={e => update('narrative', e.target.value)} rows={8} />
          </div>
        </Card>

        <Card title="Key Highlights">
          <div className="space-y-2">
            {exp.highlights.map((h, i) => (
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

        <Card title="Program Items" description="What's included in the experience">
          <div className="space-y-2">
            {exp.program.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input value={p} onChange={e => updateListItem('program', i, e.target.value)} placeholder={`Program item #${i+1}`} className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]" />
                <button onClick={() => removeListItem('program', i)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={() => addListItem('program')}>Add Program Item</Button>
          </div>
        </Card>

        <Card title="Related Tours">
          <div className="space-y-2">
            {exp.relatedTourSlugs.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input value={s} onChange={e => updateListItem('relatedTourSlugs', i, e.target.value)} placeholder="tour-slug" className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]" />
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