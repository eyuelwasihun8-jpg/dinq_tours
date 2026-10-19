import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Download, Loader2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllDocsSorted, deleteDocById } from '../../firebase/firestore';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ConfirmModal from '../components/ui/ConfirmModal';

export default function SubscribersPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllDocsSorted('subscribers', 'createdAt', 'desc');
      setSubs(data);
    } catch (e) {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDocById('subscribers', deleteTarget.id);
      toast.success('Subscriber removed');
      setDeleteTarget(null);
      load();
    } catch (e) {
      toast.error('Failed');
    } finally {
      setDeleting(false);
    }
  };

  const exportCSV = () => {
    const headers = 'Email,Source,Subscribed Date\n';
    const rows = subs.map(s => {
      const date = s.createdAt?.toDate ? s.createdAt.toDate().toISOString() : '';
      return `"${s.email}","${s.source || 'direct'}","${date}"`;
    }).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dinq-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('CSV downloaded');
  };

  const formatDate = (ts) => {
    if (!ts) return '—';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Newsletter Subscribers"
        subtitle={`${subs.length} email subscribers`}
        actions={
          <Button icon={Download} onClick={exportCSV} disabled={subs.length === 0}>
            Export CSV
          </Button>
        }
      />

      {loading ? (
        <div className="text-center py-16"><Loader2 className="w-10 h-10 animate-spin text-[#C88A2E] mx-auto" /></div>
      ) : subs.length === 0 ? (
        <Card className="text-center py-16">
          <Mail className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-stone-900">No subscribers yet</h3>
          <p className="text-sm text-stone-500 mt-2">When visitors sign up via the newsletter form, they'll appear here.</p>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="text-left px-6 py-3 text-[10px] font-bold text-stone-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3 text-[10px] font-bold text-stone-500 uppercase tracking-wider">Source</th>
                <th className="text-left px-6 py-3 text-[10px] font-bold text-stone-500 uppercase tracking-wider">Subscribed</th>
                <th className="text-right px-6 py-3 text-[10px] font-bold text-stone-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((sub) => (
                <tr key={sub.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-stone-900">
                    <a href={`mailto:${sub.email}`} className="hover:text-[#C88A2E]">{sub.email}</a>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                      {sub.source || 'direct'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-stone-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(sub.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setDeleteTarget(sub)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Subscriber?"
        message={`Remove "${deleteTarget?.email}" from the subscriber list?`}
        loading={deleting}
      />
    </div>
  );
}