import { useCallback, useEffect, useState } from 'react';
import {
  db,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  serverTimestamp,
} from '../firebase';
import type { Category } from '../types';

function toCategory(id: string, data: any): Category {
  return {
    id,
    name: data.name,
    sortOrder: data.sortOrder ?? 500,
    icon: data.icon ?? null,
    createdByEmail: data.createdByEmail ?? null,
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const q = query(collection(db, 'categories'), orderBy('sortOrder', 'asc'));
    const snap = await getDocs(q);
    setCategories(snap.docs.map((d) => toCategory(d.id, d.data())));
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addCategory = useCallback(
    async (name: string, icon: string | null, email: string | null) => {
      const trimmed = name.trim();
      if (!trimmed) return null;

      // מניעת כפילויות: חיפוש קטגוריה קיימת עם אותו שם
      const existingQ = query(collection(db, 'categories'), where('name', '==', trimmed));
      const existingSnap = await getDocs(existingQ);
      if (!existingSnap.empty) {
        await reload();
        const d = existingSnap.docs[0];
        return toCategory(d.id, d.data());
      }

      const docRef = await addDoc(collection(db, 'categories'), {
        name: trimmed,
        icon,
        sortOrder: 500,
        createdByEmail: email,
        createdAt: serverTimestamp(),
      });
      await reload();
      return { id: docRef.id, name: trimmed, sortOrder: 500, icon, createdByEmail: email, createdAt: Date.now() };
    },
    [reload]
  );

  return { categories, loading, addCategory, reload };
}
