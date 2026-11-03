import { useEffect, useState } from 'react';
import { db, collection, onSnapshot, query, where, orderBy } from '../firebase';
import type { ShoppingList, ListStatus } from '../types';

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

export function useLists(status: ListStatus) {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'lists'),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setLists(snap.docs.map((d) => toShoppingList(d.id, d.data())));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [status]);

  return { lists, loading };
}
