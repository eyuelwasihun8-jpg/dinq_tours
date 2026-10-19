import React, { useState, useEffect } from 'react';
import { Save, Loader2, Building, Phone, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDocById, setDocWithId } from '../../firebase/firestore';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import companyStatic from '../../data/companyData';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getDocById('settings', 'company');
      setSettings(data || companyStatic);
    } catch (e) {
      setSettings(companyStatic);
    } finally {
      setLoading(false);
    }
  };

  const update = (path, value) => {
    const keys = path.split('.');
    const newSettings = JSON.parse(JSON.stringify(settings));
    let target = newSettings;
    for (let i = 0; i < keys.length - 1; i++) {
      target = target[keys[i]] = target[keys[i]] || {};
    }
    target[keys[keys.length - 1]] = value;
    setSettings(newSettings);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDocWithId('settings', 'company', settings);
      toast.success('Settings saved');
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
        title="Site Settings"
        subtitle="Company info, contact details, and global settings"
        actions={<Button icon={Save} onClick={handleSave} loading={saving}>Save Settings</Button>}
      />

      <div className="space-y-6">
        <Card title="Company Identity">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Brand Name" value={settings.name || ''} onChange={e => update('name', e.target.value)} />
              <Input label="Full Name (Legal)" value={settings.fullName || ''} onChange={e => update('fullName', e.target.value)} />
            </div>
            <Input label="Native Name (Amharic)" value={settings.nativeName || ''} onChange={e => update('nativeName', e.target.value)} />
            <Input label="Former Name" value={settings.formerName || ''} onChange={e => update('formerName', e.target.value)} />
            <Input label="Primary Tagline" value={settings.tagline || ''} onChange={e => update('tagline', e.target.value)} />
            <Input label="Sub-Tagline" value={settings.subTagline || ''} onChange={e => update('subTagline', e.target.value)} />
            <Textarea label="Description" value={settings.description || ''} onChange={e => update('description', e.target.value)} rows={3} />
            <Textarea label="Meaning of DINQ" value={settings.meaning || ''} onChange={e => update('meaning', e.target.value)} rows={3} />
            <div className="grid grid-cols-3 gap-4">
              <Input label="Founded Year" value={settings.foundedYear || ''} onChange={e => update('foundedYear', e.target.value)} />
              <Input label="Years Experience" value={settings.yearsExperience || ''} onChange={e => update('yearsExperience', e.target.value)} />
              <Input label="License Number" value={settings.licenseNumber || ''} onChange={e => update('licenseNumber', e.target.value)} />
            </div>
          </div>
        </Card>

        <Card title="Contact Information">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Phone" value={settings.contact?.phone || ''} onChange={e => update('contact.phone', e.target.value)} />
              <Input label="Phone Display" value={settings.contact?.phoneDisplay || ''} onChange={e => update('contact.phoneDisplay', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="WhatsApp Number" value={settings.contact?.whatsapp || ''} onChange={e => update('contact.whatsapp', e.target.value)} />
              <Input label="WhatsApp Link" value={settings.contact?.whatsappLink || ''} onChange={e => update('contact.whatsappLink', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="Primary Email" value={settings.contact?.primaryEmail || ''} onChange={e => update('contact.primaryEmail', e.target.value)} />
              <Input label="Bookings Email" value={settings.contact?.bookingsEmail || ''} onChange={e => update('contact.bookingsEmail', e.target.value)} />
              <Input label="Contact Email" value={settings.contact?.contactEmail || ''} onChange={e => update('contact.contactEmail', e.target.value)} />
            </div>
            <Input label="Emergency Support" value={settings.contact?.emergencySupport || ''} onChange={e => update('contact.emergencySupport', e.target.value)} />
          </div>
        </Card>

        <Card title="Headquarters Address">
          <div className="space-y-4">
            <Input label="Street Address" value={settings.headquarters?.address || ''} onChange={e => update('headquarters.address', e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input label="City" value={settings.headquarters?.city || ''} onChange={e => update('headquarters.city', e.target.value)} />
              <Input label="Country" value={settings.headquarters?.country || ''} onChange={e => update('headquarters.country', e.target.value)} />
              <Input label="P.O. Box" value={settings.headquarters?.poBox || ''} onChange={e => update('headquarters.poBox', e.target.value)} />
            </div>
          </div>
        </Card>

        <Card title="Business Hours">
          <div className="space-y-3">
            <Input label="Weekday Hours" value={settings.hours?.weekday || ''} onChange={e => update('hours.weekday', e.target.value)} />
            <Input label="Saturday Hours" value={settings.hours?.saturday || ''} onChange={e => update('hours.saturday', e.target.value)} />
            <Input label="Sunday Policy" value={settings.hours?.sunday || ''} onChange={e => update('hours.sunday', e.target.value)} />
            <Input label="Traveler Assistance" value={settings.hours?.travelerAssistance || ''} onChange={e => update('hours.travelerAssistance', e.target.value)} />
          </div>
        </Card>

        <Card title="Social Media Links">
          <div className="space-y-3">
            <Input label="Facebook URL" value={settings.social?.facebook || ''} onChange={e => update('social.facebook', e.target.value)} />
            <Input label="Instagram URL" value={settings.social?.instagram || ''} onChange={e => update('social.instagram', e.target.value)} />
            <Input label="LinkedIn URL" value={settings.social?.linkedin || ''} onChange={e => update('social.linkedin', e.target.value)} />
            <Input label="WhatsApp Group" value={settings.social?.whatsappGroup || ''} onChange={e => update('social.whatsappGroup', e.target.value)} />
          </div>
        </Card>
      </div>
    </div>
  );
}