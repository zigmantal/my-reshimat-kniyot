import { db, collection, getDocs, addDoc, serverTimestamp } from './firebase';
import { SEED_CATEGORIES, SEED_ITEMS } from './seedData';

/**
 * זריעת נתונים ראשונית (קטגוריות + מוצרים נפוצים) בפעם הראשונה בלבד.
 * רץ אוטומטית מתוך App.tsx לאחר התחברות, בודק קודם שהאוסף ריק כדי
 * שלא ליצור כפילויות אם מישהו כבר התחיל להשתמש באפליקציה.
 */
export async function seedDatabaseIfEmpty(email: string | null) {
  const categoriesSnap = await getDocs(collection(db, 'categories'));
  if (!categoriesSnap.empty) return; // כבר יש נתונים, לא עושים כלום

  const nameToId = new Map<string, string>();

  for (const cat of SEED_CATEGORIES) {
    const ref = await addDoc(collection(db, 'categories'), {
      name: cat.name,
      icon: cat.icon,
      sortOrder: cat.sortOrder,
      createdByEmail: email,
      createdAt: serverTimestamp(),
    });
    nameToId.set(cat.name, ref.id);
  }

  for (const item of SEED_ITEMS) {
    const categoryId = nameToId.get(item.categoryName) ?? null;
    await addDoc(collection(db, 'catalogItems'), {
      name: item.name,
      categoryId,
      brandOrNote: null,
      defaultUnit: item.defaultUnit,
      createdByEmail: email,
      createdAt: serverTimestamp(),
    });
  }
}
