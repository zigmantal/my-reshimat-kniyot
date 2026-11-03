import { useCallback, useEffect, useState } from 'react';
import {
  db,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from '../firebase';
import type { CatalogItem } from '../types';

function toCatalogItem(id: string, data: any): CatalogItem {
  return {
    id,
    name: data.name,
    categoryId: data.categoryId ?? null,
    brandOrNote: data.brandOrNote ?? null,
    defaultUnit: data.defaultUnit ?? null,
    createdByEmail: data.createdByEmail ?? null,
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
  };
}

export function useCatalogItems() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const q = query(collection(db, 'catalogItems'), orderBy('name', 'asc'));
    const snap = await getDocs(q);
    setItems(snap.docs.map((d) => toCatalogItem(d.id, d.data())));
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addItem = useCallback(
    async (input: {
      name: string;
      categoryId: string | null;
      brandOrNote?: string | null;
      defaultUnit?: string | null;
      email: string | null;
    }) => {
      const trimmed = input.name.trim();
      if (!trimmed) return null;
      const docRef = await addDoc(collection(db, 'catalogItems'), {
        name: trimmed,
        categoryId: input.categoryId,
        brandOrNote: input.brandOrNote || null,
        defaultUnit: input.defaultUnit || null,
        createdByEmail: input.email,
        createdAt: serverTimestamp(),
      });
      await reload();
      return {
        id: docRef.id,
        name: trimmed,
        categoryId: input.categoryId,
        brandOrNote: input.brandOrNote || null,
        defaultUnit: input.defaultUnit || null,
        createdByEmail: input.email,
        createdAt: Date.now(),
      };
    },
    [reload]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      await deleteDoc(doc(db, 'catalogItems', id));
      await reload();
    },
    [reload]
  );

  return { items, loading, addItem, deleteItem, reload };
}
