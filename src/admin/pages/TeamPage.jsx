import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDocById, setDocWithId } from '../../firebase/firestore';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import UploadWidget from '../../cloudinary/UploadWidget';
import teamStatic from '../../data/teamData';

const EMPTY_MEMBER = {
  id: '',
  name: '',
  amharicName: '',
  role: '',
  bio: '',
  shortBio: '',
  image: '',
  quote: '',
  languages: [],
  specialties: [],
};

const EMPTY_CATEGORY = {
  id: '',
  icon: '',
  title: '',
  desc: '',
};

export default function TeamPage() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getDocById('settings', 'team');
      if (data) {
        setTeam(data);
      } else {
        // Initialize with static data if nothing in DB yet
        setTeam({
          leadership: teamStatic.leadership,
          teamCategories: teamStatic.teamCategories,
          promise: teamStatic.promise,
        });
      }
    } catch (e) {
      toast.error('Failed to load team data');
      setTeam({ leadership: [], teamCategories: [], promise: {} });
    } finally {
      setLoading(false);
    }
  };

  const updateLeader = (idx, field, value) => {
    const leaders = [...team.leadership];
    leaders[idx] = { ...leaders[idx], [field]: value };
    setTeam({ ...team, leadership: leaders });
  };

  const addLeader = () => {
    setTeam({ ...team, leadership: [...team.leadership, { ...EMPTY_MEMBER, id: `member-${Date.now()}` }] });
  };

  const removeLeader = (idx) => {
    setTeam({ ...team, leadership: team.leadership.filter((_, i) => i !== idx) });
  };

  const updateCategory = (idx, field, value) => {
    const cats = [...team.teamCategories];
    cats[idx] = { ...cats[idx], [field]: value };
    setTeam({ ...team, teamCategories: cats });
  };

  const addCategory = () => {
    setTeam({ ...team, teamCategories: [...team.teamCategories, { ...EMPTY_CATEGORY, id: `cat-${Date.now()}` }] });
  };

  const removeCategory = (idx) => {
    setTeam({ ...team, teamCategories: team.teamCategories.filter((_, i) => i !== idx) });
  };

  const updatePromise = (field, value) => {
    setTeam({ ...team, promise: { ...team.promise, [field]: value } });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDocWithId('settings', 'team', team);
      toast.success('Team saved');
    } catch (e) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-16"><Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" /></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Team Management"
        subtitle="Manage leadership team and professional field crew"
        actions={<Button icon={Save} onClick={handleSave} loading={saving}>Save All Changes</Button>}
      />

      <div className="space-y-6">
        {/* LEADERSHIP */}
        <Card title="Leadership Team" description="Zerihun, Eldana, Semegn & other senior members">
          <div className="space-y-4">
            {team.leadership.map((member, idx) => (
              <div key={idx} className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h4 className="font-serif text-lg font-bold text-stone-900">{member.name || 'New Member'}</h4>
                  <button onClick={() => removeLeader(idx)} className="p-1.5 text-rose-500 hover:bg-rose-100 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <UploadWidget label="Portrait Photo" currentImage={member.image} onUpload={url => updateLeader(idx, 'image', url)} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input label="Full Name" value={member.name} onChange={e => updateLeader(idx, 'name', e.target.value)} />
                  <Input label="Amharic Name" value={member.amharicName} onChange={e => updateLeader(idx, 'amharicName', e.target.value)} placeholder="ልጅ ዘሪሁን አለማየሁ" />
                </div>

                <Input label="Role / Title" value={member.role} onChange={e => updateLeader(idx, 'role', e.target.value)} placeholder="Founder & COO" />
                <Textarea label="Short Bio (1 line)" value={member.shortBio} onChange={e => updateLeader(idx, 'shortBio', e.target.value)} rows={2} />
                <Textarea label="Full Bio" value={member.bio} onChange={e => updateLeader(idx, 'bio', e.target.value)} rows={4} />
                <Textarea label="Quote (Optional)" value={member.quote} onChange={e => updateLeader(idx, 'quote', e.target.value)} rows={3} placeholder="Tourism has been my passion since childhood..." />
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={addLeader}>Add Team Member</Button>
          </div>
        </Card>

        {/* FIELD TEAM CATEGORIES */}
        <Card title="Field Team Categories" description="8 categories like drivers, guides, media crew">
          <div className="space-y-3">
            {team.teamCategories.map((cat, idx) => (
              <div key={idx} className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-3">
                <div className="flex-1 grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-2">
                    <Input label="Icon" value={cat.icon} onChange={e => updateCategory(idx, 'icon', e.target.value)} placeholder="🚐" />
                  </div>
                  <div className="col-span-4">
                    <Input label="Title" value={cat.title} onChange={e => updateCategory(idx, 'title', e.target.value)} placeholder="Professional Drivers" />
                  </div>
                  <div className="col-span-6">
                    <Textarea label="Description" value={cat.desc} onChange={e => updateCategory(idx, 'desc', e.target.value)} rows={2} />
                  </div>
                </div>
                <button onClick={() => removeCategory(idx)} className="p-2 text-rose-500 hover:bg-rose-100 rounded mt-6">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="outline" icon={Plus} onClick={addCategory}>Add Category</Button>
          </div>
        </Card>

        {/* TEAM PROMISE */}
        <Card title="Team Promise Statement" description="The closing message on the About page">
          <div className="space-y-4">
            <Input label="Headline" value={team.promise?.headline || ''} onChange={e => updatePromise('headline', e.target.value)} placeholder="One Team. One Standard." />
            <Textarea label="Body" value={team.promise?.body || ''} onChange={e => updatePromise('body', e.target.value)} rows={2} />
            <Input label="Closing Line" value={team.promise?.closing || ''} onChange={e => updatePromise('closing', e.target.value)} placeholder="Local Expertise. Global Standards. Extraordinary Ethiopia." />
          </div>
        </Card>
      </div>
    </div>
  );
}