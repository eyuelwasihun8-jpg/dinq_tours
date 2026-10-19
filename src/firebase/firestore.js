import { db } from './config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

/* ============================================================
   GENERIC CRUD HELPERS — Reusable across all collections
============================================================ */

// Get all documents from a collection
export async function getAllDocs(collectionName) {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Get a single document by ID
export async function getDocById(collectionName, docId) {
  const docRef = doc(db, collectionName, docId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

// Get a single document by a field (e.g., slug)
export async function getDocByField(collectionName, field, value) {
  const q = query(collection(db, collectionName), where(field, '==', value), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

// Create a new document (with auto-generated ID)
export async function createDoc(collectionName, data) {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Create or overwrite a document with a specific ID
export async function setDocWithId(collectionName, docId, data) {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
  return docId;
}

// Update an existing document
export async function updateDocById(collectionName, docId, data) {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete a document
export async function deleteDocById(collectionName, docId) {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}

// Get all docs sorted by a field
export async function getAllDocsSorted(collectionName, orderField = 'createdAt', orderDirection = 'desc') {
  const q = query(collection(db, collectionName), orderBy(orderField, orderDirection));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Batch write — useful for migration
export async function batchWrite(collectionName, items) {
  const batch = writeBatch(db);
  items.forEach((item) => {
    const docRef = item.id
      ? doc(db, collectionName, item.id)
      : doc(collection(db, collectionName));
    const { id, ...data } = item;
    batch.set(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
  await batch.commit();
}