import { useCallback, useEffect, useState } from 'react';
import {
  db,
  doc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from '../firebase';
import type { ShoppingList, ListItem } from '../types';

function toShoppingList(id: string, data: any): ShoppingList {
  return {
    id,
    title: data.title ?? null,
    status: data.status,
    createdByEmail: data.createdByEmail ?? null,
    createdByName: data.createdByName ?? null,
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
    completedAt: data.completedAt?.toMillis ? data.completedAt.toMillis() : null,
  };
}

function toListItem(id: string, listId: string, data: any): ListItem {
  return {
    id,
    listId,
    catalogItemId: data.catalogItemId ?? null,
    nameSnapshot: data.nameSnapshot,
    categoryId: data.categoryId ?? null,
    categoryNameSnapshot: data.categoryNameSnapshot ?? null,
    brandOrNote: data.brandOrNote ?? null,
    quantity: data.quantity ?? 1,
    unit: data.unit ?? null,
    checked: !!data.checked,
    addedByEmail: data.addedByEmail ?? null,
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
  };
}

export function useListDetail(listId: string | undefined) {
  const [list, setList] = useState<ShoppingList | null>(null);
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!listId) return;
    setLoading(true);

    const unsubList = onSnapshot(doc(db, 'lists', listId), (snap) => {
      setList(snap.exists() ? toShoppingList(snap.id, snap.data()) : null);
    });

    const itemsQ = query(collection(db, 'lists', listId, 'items'), orderBy('createdAt', 'asc'));
    const unsubItems = onSnapshot(itemsQ, (snap) => {
      setItems(snap.docs.map((d) => toListItem(d.id, listId, d.data())));
      setLoading(false);
    });

    return () => {
      unsubList();
      unsubItems();
    };
  }, [listId]);

  const toggleChecked = useCallback(
    async (itemId: string, checked: boolean) => {
      if (!listId) return;
      await updateDoc(doc(db, 'lists', listId, 'items', itemId), { checked });
    },
    [listId]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!listId) return;
      await deleteDoc(doc(db, 'lists', listId, 'items', itemId));
    },
    [listId]
  );

  const addQuickItem = useCallback(
    async (input: {
      listId: string;
      nameSnapshot: string;
      categoryId: string | null;
      categoryNameSnapshot: string | null;
      catalogItemId: string | null;
      brandOrNote: string | null;
      quantity: number;
      unit: string | null;
      email: string | null;
    }) => {
      await addDoc(collection(db, 'lists', input.listId, 'items'), {
        catalogItemId: input.catalogItemId,
        nameSnapshot: input.nameSnapshot,
        categoryId: input.categoryId,
        categoryNameSnapshot: input.categoryNameSnapshot,
        brandOrNote: input.brandOrNote,
        quantity: input.quantity,
        unit: input.unit,
        checked: false,
        addedByEmail: input.email,
        createdAt: serverTimestamp(),
      });
    },
    []
  );

  const markDone = useCallback(async () => {
    if (!listId) return;
    await updateDoc(doc(db, 'lists', listId), {
      status: 'done',
      completedAt: serverTimestamp(),
    });
  }, [listId]);

  const deleteList = useCallback(async () => {
    if (!listId) return;
    // מחיקת כל הפריטים בתת-האוסף, ואז הרשימה עצמה
    const itemsSnap = await getDocs(
      query(collection(db, 'lists', listId, 'items'), orderBy('createdAt', 'asc'))
    );
    await Promise.all(itemsSnap.docs.map((d) => deleteDoc(d.ref)));
    await deleteDoc(doc(db, 'lists', listId));
  }, [listId]);

  return { list, items, loading, toggleChecked, removeItem, addQuickItem, markDone, deleteList };
}
