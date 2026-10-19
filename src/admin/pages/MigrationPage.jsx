import React, { useState, useEffect } from 'react';
import { Database, Check, Loader2, AlertTriangle, Play, Settings as SettingsIcon, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// Import all static data (handles both default + named exports)
import toursDataImport from '../../data/toursData';
import destinationsDataImport from '../../data/destinationsData';
import * as tourTypesModule from '../../data/tourTypesData';
import experiencesDataImport from '../../data/experiencesData';
import * as regionsModule from '../../data/regionsData';
import signatureRoutesImport from '../../data/signatureRoutesData';
import * as mountainsModule from '../../data/mountainsData';
import safariImport from '../../data/safariData';
import unescoImport from '../../data/unescoData';
import festivalsImport from '../../data/festivalsData';
import birdingImport from '../../data/birdingData';
import * as shopModule from '../../data/shopData';
import teamDataImport from '../../data/teamData';
import companyDataImport from '../../data/companyData';

// Normalize imports (handles if someone used named vs default)
const toursData = toursDataImport || [];
const destinationsData = destinationsDataImport || [];
const tourTypesData = tourTypesModule.tourTypesData || tourTypesModule.default || [];
const experiencesData = experiencesDataImport || [];
const regionsData = regionsModule.regionsData || regionsModule.default || [];
const signatureRoutesData = signatureRoutesImport || [];
const mountainsData = mountainsModule.mountainsData || mountainsModule.default || [];
const safariData = safariImport || [];
const unescoData = unescoImport || [];
const festivalsData = festivalsImport || [];
const birdingData = birdingImport || [];
const shopCategories = shopModule.shopCategories || [];
const shopProducts = shopModule.shopProducts || [];
const teamData = teamDataImport || {};
const companyData = companyDataImport || {};

const MIGRATIONS = [
  { collection: 'tours', data: toursData, label: 'Tours & Safaris' },
  { collection: 'destinations', data: destinationsData, label: 'Destinations' },
  { collection: 'regions', data: regionsData, label: 'Regional Routes' },
  { collection: 'signatureRoutes', data: signatureRoutesData, label: 'Signature Routes' },
  { collection: 'mountains', data: mountainsData, label: 'Mountains' },
  { collection: 'safari', data: safariData, label: 'Safari' },
  { collection: 'unesco', data: unescoData, label: 'UNESCO Sites' },
  { collection: 'festivals', data: festivalsData, label: 'Festivals' },
  { collection: 'birding', data: birdingData, label: 'Birding' },
  { collection: 'experiences', data: experiencesData, label: 'Experiences' },
  { collection: 'tourTypes', data: tourTypesData, label: 'Tour Types' },
  { collection: 'shopCategories', data: shopCategories, label: 'Shop Categories' },
  { collection: 'shopProducts', data: shopProducts, label: 'Shop Products' },
];

export default function MigrationPage() {
  const [status, setStatus] = useState({});
  const [running, setRunning] = useState(false);
  const [existingCounts, setExistingCounts] = useState({});
  const [log, setLog] = useState([]);

  const addLog = (msg, type = 'info') => {
    setLog(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  const checkExisting = async () => {
    addLog('🔍 Scanning database...', 'info');
    const counts = {};
    for (const m of MIGRATIONS) {
      try {
        const snapshot = await getDocs(collection(db, m.collection));
        counts[m.collection] = snapshot.size;
      } catch (e) {
        counts[m.collection] = 0;
        addLog(`❌ Could not scan ${m.collection}: ${e.message}`, 'error');
      }
    }
    setExistingCounts(counts);
    toast.success('Database scanned');
    addLog('✅ Database scan complete', 'success');
  };

  useEffect(() => {
    checkExisting();
  }, []);

  /**
   * SMART MIGRATE — one document at a time (so one failure doesn't stop all)
   * Uses item.id as the document ID when available for consistent references
   */
  const migrateOne = async (m) => {
    setStatus(s => ({ ...s, [m.collection]: 'running' }));
    addLog(`📦 Starting migration of ${m.label} (${m.data.length} items)...`, 'info');

    if (!m.data || m.data.length === 0) {
      addLog(`⚠️ No static data found for ${m.label} — skipping`, 'warning');
      setStatus(s => ({ ...s, [m.collection]: 'error' }));
      return false;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const item of m.data) {
      try {
        // Use the item's id as the Firestore document ID if available
        const docId = item.id || item.slug || undefined;
        const { id, ...dataWithoutId } = item;

        const docRef = docId 
          ? doc(db, m.collection, String(docId))
          : doc(collection(db, m.collection));

        await setDoc(docRef, {
          ...dataWithoutId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`Failed to write ${m.collection} item:`, item, error);
        addLog(`  ❌ Failed item: ${item.slug || item.id || 'unknown'} — ${error.message}`, 'error');
      }
    }

    if (errorCount === 0) {
      setStatus(s => ({ ...s, [m.collection]: 'done' }));
      addLog(`✅ ${m.label}: ${successCount} items uploaded successfully`, 'success');
      return true;
    } else {
      setStatus(s => ({ ...s, [m.collection]: 'partial' }));
      addLog(`⚠️ ${m.label}: ${successCount} ok, ${errorCount} failed`, 'warning');
      return false;
    }
  };

  const migrateSettings = async () => {
    addLog('📦 Migrating team settings...', 'info');
    setStatus(s => ({ ...s, 'settings-team': 'running' }));
    try {
      await setDoc(doc(db, 'settings', 'team'), {
        leadership: teamData.leadership || [],
        teamCategories: teamData.teamCategories || [],
        promise: teamData.promise || {},
        updatedAt: serverTimestamp(),
      });
      setStatus(s => ({ ...s, 'settings-team': 'done' }));
      addLog('✅ Team settings saved', 'success');
    } catch (error) {
      console.error(error);
      setStatus(s => ({ ...s, 'settings-team': 'error' }));
      addLog(`❌ Team settings failed: ${error.message}`, 'error');
    }

    addLog('📦 Migrating company settings...', 'info');
    setStatus(s => ({ ...s, 'settings-company': 'running' }));
    try {
      await setDoc(doc(db, 'settings', 'company'), {
        ...companyData,
        updatedAt: serverTimestamp(),
      });
      setStatus(s => ({ ...s, 'settings-company': 'done' }));
      addLog('✅ Company settings saved', 'success');
    } catch (error) {
      console.error(error);
      setStatus(s => ({ ...s, 'settings-company': 'error' }));
      addLog(`❌ Company settings failed: ${error.message}`, 'error');
    }
  };

  const migrateAll = async () => {
    if (!confirm('⚠️ This will seed Firestore with all static data. Existing documents with same IDs will be overwritten. Continue?')) return;
    
    setRunning(true);
    setStatus({});
    setLog([]);
    addLog('🚀 Starting full migration...', 'info');

    for (const m of MIGRATIONS) {
      await migrateOne(m);
    }
    
    await migrateSettings();

    addLog('🎉 Migration complete!', 'success');
    setRunning(false);
    toast.success('🎉 All data migrated! Check your public site.');
    checkExisting();
  };

  const statusBadge = (st) => {
    if (st === 'running') return <Loader2 className="w-5 h-5 animate-spin text-amber-600" />;
    if (st === 'done') return <span className="flex items-center gap-1 text-emerald-700 text-xs font-bold"><Check className="w-4 h-4" />Done</span>;
    if (st === 'error') return <span className="text-rose-700 text-xs font-bold">Failed</span>;
    if (st === 'partial') return <span className="text-amber-700 text-xs font-bold">Partial</span>;
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Seed Database Migration"
        subtitle="Upload all static JavaScript data into Firestore. Safe to re-run anytime."
      />

      <Card className="mb-6 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 space-y-2">
            <p><strong>ℹ️ How this works:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Each static item is written to Firestore using its <code>id</code> as the document ID</li>
              <li>Re-running overwrites existing docs with same ID (safe for updates)</li>
              <li>Each item is uploaded individually — if one fails, others still succeed</li>
              <li>After migration, edit in admin → changes appear on public site in real-time</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="outline" onClick={checkExisting} icon={Database}>
          Refresh Counts
        </Button>
        <Button variant="primary" onClick={migrateAll} loading={running} icon={Upload}>
          Seed All Collections + Settings
        </Button>
        <Button variant="outline" onClick={migrateSettings} icon={SettingsIcon}>
          Seed Team + Company Only
        </Button>
      </div>

      <Card title="Collections to Migrate" description={`${MIGRATIONS.length} content collections + 2 settings documents`}>
        <div className="space-y-2">
          {MIGRATIONS.map((m) => {
            const st = status[m.collection];
            const existing = existingCounts[m.collection];
            return (
              <div key={m.collection} className="flex items-center justify-between py-3 px-4 bg-stone-50 rounded-xl border border-stone-100">
                <div className="flex-1">
                  <div className="text-sm font-bold text-stone-900">{m.label}</div>
                  <div className="text-xs text-stone-500">
                    <code className="bg-stone-100 px-1.5 py-0.5 rounded">{m.collection}</code>
                    {' • '}
                    <span>{m.data?.length || 0} items to upload</span>
                    {existing !== undefined && (
                      <span className="ml-2 text-emerald-700 font-semibold">
                        ({existing} in DB)
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {statusBadge(st)}
                  {!st && !running && (
                    <button
                      onClick={() => migrateOne(m)}
                      className="text-xs font-semibold text-[#C88A2E] hover:underline"
                    >
                      Seed Only
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Settings Row */}
          <div className="pt-4 mt-4 border-t border-stone-200 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">Settings Documents</div>
            
            <div className="flex items-center justify-between py-3 px-4 bg-stone-50 rounded-xl border border-stone-100">
              <div className="flex-1">
                <div className="text-sm font-bold text-stone-900">Team Settings</div>
                <div className="text-xs text-stone-500">
                  Doc: <code className="bg-stone-100 px-1.5 py-0.5 rounded">settings/team</code>
                </div>
              </div>
              {statusBadge(status['settings-team'])}
            </div>

            <div className="flex items-center justify-between py-3 px-4 bg-stone-50 rounded-xl border border-stone-100">
              <div className="flex-1">
                <div className="text-sm font-bold text-stone-900">Company Settings</div>
                <div className="text-xs text-stone-500">
                  Doc: <code className="bg-stone-100 px-1.5 py-0.5 rounded">settings/company</code>
                </div>
              </div>
              {statusBadge(status['settings-company'])}
            </div>
          </div>
        </div>
      </Card>

      {/* Live Log */}
      {log.length > 0 && (
        <Card className="mt-6" title="Migration Log">
          <div className="bg-stone-950 text-stone-200 p-4 rounded-xl font-mono text-xs max-h-80 overflow-y-auto space-y-1">
            {log.map((entry, i) => (
              <div key={i} className={
                entry.type === 'error' ? 'text-rose-400' :
                entry.type === 'warning' ? 'text-amber-400' :
                entry.type === 'success' ? 'text-emerald-400' :
                'text-stone-400'
              }>
                <span className="text-stone-600">[{entry.time}]</span> {entry.msg}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}