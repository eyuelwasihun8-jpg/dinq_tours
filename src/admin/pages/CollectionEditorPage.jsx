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

const COLLECTION_CONFIG = {
  safari: {
    label: 'Safari',
    firestore: 'safari',
    backPath: '/admin/collections/safari',
    hasExperiences: true,
    hasCategory: false,
    hasTiming: false,
    hasKeySpecies: false,
    hasHabitat: false,
    hasConditionalNotice: true,
  },
  unesco: {
    label: 'UNESCO Site',
    firestore: 'unesco',
    backPath: '/admin/collections/unesco',
    hasExperiences: true,
    hasCategory: true,
    categoryOptions: ['Cultural', 'Natural'],
    hasTiming: false,
  },
  festivals: {
    label: 'Festival',
    firestore: 'festivals',
    backPath: '/admin/collections/festivals',
    hasExperiences: true,
    hasCategory: false,
    hasTiming: true,
  },
  birding: {
    label: 'Birding Spot',
    firestore: 'birding',
    backPath: '/admin/collections/birding',
    hasExperiences: false,
    hasHabitat: true,
    hasKeySpecies: true,
  },
};

const EMPTY = {
  number: '',
  slug: '',
  name: '',
  tagline: '',
  signature: '',
  heroImage: '',
  description: '',
  experiences: [''],
  category: '',
  timing: '',
  habitat: '',
  keySpecies: [''],
  subTagline: '',
  isConditionalNotice: '',
};

export default function CollectionEditorPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const config = COLLECTION_CONFIG[type];
  const isNew = !id;

  const [item, setItem] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && config) {
      getDocById(config.firestore, id).then(data => {
        if (data) {
          setItem({
            ...EMPTY,
            ...data,
            experiences: data.experiences?.length ? data.experiences : [''],
            keySpecies: data.keySpecies?.length ? data.keySpecies : [''],
          });
        }
        setLoading(false);
      });
    }
  }, [id, type]);

  const update = (field, value) => setItem(i => ({ ...i, [field]: value }));

  const updateListItem = (field, i, value) => {
    const list = [...item[field]];
    list[i] = value;
    update(field, list);
  };
  const addListItem = (field) => update(field, [...item[field], '']);
  const removeListItem = (field, i) => update(field, item[field].filter((_, idx) => idx !== i));

  const generateSlug = () => {
    update('slug', item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  };

  const handleSave = async () => {
    if (!item.name.trim() || !item.slug.trim()) {
      toast.error('Name and slug required');
      return;
    }
    setSaving(true);
    try {
      const cleaned = {
        ...item,
        experiences: item.experiences?.filter(e => e.trim()) || [],
        keySpecies: item.keySpecies?.filter(k => k.trim()) || [],
      };

      if (isNew) {
        const newId = await createDoc(config.firestore, cleaned);
        toast.success(`${config.label} created`);
        navigate(`/admin/collections/${type}/${newId}/edit`);
      } else {
        await updateDocById(config.firestore, id, cleaned);
        toast.success(`${config.label} saved`);
      }
    } catch (e) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!config) return <div className="text-center py-16 text-stone-500">Invalid type</div>;
  if (loading) return <div className="text-center py-16"><Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" /></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title={isNew ? `New ${config.label}` : `Edit: ${item.name}`}
        backTo={config.backPath}
        actions={<Button icon={Save} onClick={handleSave} loading={saving}>Save</Button>}
      />

      <div className="space-y-6">
        <Card title="Basic Info">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Input label="Number" value={item.number} onChange={e => update('number', e.target.value)} placeholder="01" />
              <div className="col-span-2">
                <Input label="Slug" required value={item.slug} onChange={e => update('slug', e.target.value)} />
                <button type="button" onClick={generateSlug} className="text-xs text-[#C88A2E] font-semibold hover:underline mt-1">Generate from name</button>
              </div>
            </div>

            <Input label="Name" required value={item.name} onChange={e => update('name', e.target.value)} />
            <Input label="Tagline" value={item.tagline} onChange={e => update('tagline', e.target.value)} />
            <Input label="Signature Name" value={item.signature} onChange={e => update('signature', e.target.value)} placeholder="e.g., The Sacred Lalibela Journey" />

            {config.hasCategory && (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">Category</label>
                <select 
                  value={item.category} 
                  onChange={e => update('category', e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]"
                >
                  <option value="">Select category...</option>
                  {config.categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            {config.hasTiming && (
              <Input label="Timing / Season" value={item.timing} onChange={e => update('timing', e.target.value)} placeholder="January 19-20 (Annual)" />
            )}

            {config.hasHabitat && (
              <Input label="Habitat" value={item.habitat} onChange={e => update('habitat', e.target.value)} placeholder="Alpine moorland, Harenna forest..." />
            )}

            <Textarea label="Description" value={item.description} onChange={e => update('description', e.target.value)} rows={5} />

            {config.hasConditionalNotice && (
              <Textarea 
                label="Conditional Notice (Optional)" 
                value={item.isConditionalNotice} 
                onChange={e => update('isConditionalNotice', e.target.value)}
                rows={2}
                placeholder="e.g., Erta Ale is an active volcanic environment..."
              />
            )}

            <Input label="Sub-Tagline (Optional)" value={item.subTagline} onChange={e => update('subTagline', e.target.value)} />
          </div>
        </Card>

        <Card title="Hero Image">
          <UploadWidget label="" currentImage={item.heroImage} onUpload={url => update('heroImage', url)} />
        </Card>

        {config.hasExperiences && (
          <Card title="Experiences & Activities" description="What travelers can do here">
            <div className="space-y-2">
              {item.experiences.map((e, i) => (
                <div key={i} className="flex gap-2">
                  <input 
                    value={e} 
                    onChange={ev => updateListItem('experiences', i, ev.target.value)}
                    placeholder="e.g., Wildlife viewing"
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]"
                  />
                  <button onClick={() => removeListItem('experiences', i)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Button variant="outline" icon={Plus} onClick={() => addListItem('experiences')}>Add Experience</Button>
            </div>
          </Card>
        )}

        {config.hasKeySpecies && (
          <Card title="Target Bird Species" description="Key species travelers can spot">
            <div className="space-y-2">
              {item.keySpecies.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input 
                    value={s}
                    onChange={ev => updateListItem('keySpecies', i, ev.target.value)}
                    placeholder="e.g., Bearded Vulture (Lammergeier)"
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]"
                  />
                  <button onClick={() => removeListItem('keySpecies', i)} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Button variant="outline" icon={Plus} onClick={() => addListItem('keySpecies')}>Add Species</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}