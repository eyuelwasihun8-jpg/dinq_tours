import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, where, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * REAL-TIME COLLECTION HOOK
 */
export function useCollection(collectionName, fallbackData = []) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const docs = snapshot.docs.map((d) => {
          const data = { id: d.id, ...d.data() };
          // Add timestamp to document to force React re-render with new images
          return { ...data, _updatedKey: d.data().updatedAt?.seconds || Date.now() };
        });
        
        if (docs.length > 0) {
          setData(docs);
        } else {
          setData(fallbackData);
        }
        setLoading(false);
      },
      (err) => {
        console.error(`❌ Error listening to ${collectionName}:`, err);
        setError(err);
        setData(fallbackData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
}

/**
 * REAL-TIME DOCUMENT HOOK (by slug field)
 */
export function useDocBySlug(collectionName, slug, fallbackData = null) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName || !slug) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, collectionName),
      where('slug', '==', slug),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          const docData = { id: docSnap.id, ...docSnap.data() };
          setData({ ...docData, _updatedKey: docSnap.data().updatedAt?.seconds || Date.now() });
        } else {
          setData(fallbackData);
        }
        setLoading(false);
      },
      (err) => {
        console.error(`❌ Error listening to ${collectionName}/${slug}:`, err);
        setError(err);
        setData(fallbackData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, slug]);

  return { data, loading, error };
}

/**
 * REAL-TIME DOCUMENT HOOK (by ID)
 */
export function useDocById(collectionName, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName || !docId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, collectionName, docId),
      (snapshot) => {
        if (snapshot.exists()) {
          const docData = { id: snapshot.id, ...snapshot.data() };
          setData({ ...docData, _updatedKey: snapshot.data().updatedAt?.seconds || Date.now() });
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error(`❌ Error listening to ${collectionName}/${docId}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId]);

  return { data, loading, error };
}