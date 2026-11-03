export interface SeedCategory {
  name: string;
  icon: string;
  sortOrder: number;
}

export interface SeedItem {
  name: string;
  categoryName: string;
  defaultUnit: string;
}

export const SEED_CATEGORIES: SeedCategory[] = [
  { name: 'ירקות ופירות', icon: '🥦', sortOrder: 10 },
  { name: 'מוצרי חלב וביצים', icon: '🧀', sortOrder: 20 },
  { name: 'בשר, עוף ודגים', icon: '🍗', sortOrder: 30 },
  { name: 'מאפים ולחם', icon: '🍞', sortOrder: 40 },
  { name: 'שימורים ורטבים', icon: '🥫', sortOrder: 50 },
  { name: 'יבשים, אורז ופסטה', icon: '🍚', sortOrder: 60 },
  { name: 'תבלינים ואפייה', icon: '🧂', sortOrder: 70 },
  { name: 'קפואים', icon: '🧊', sortOrder: 80 },
  { name: 'משקאות', icon: '🥤', sortOrder: 90 },
  { name: 'חטיפים וממתקים', icon: '🍫', sortOrder: 100 },
  { name: 'ניקיון לבית', icon: '🧽', sortOrder: 110 },
  { name: 'היגיינה וטיפוח', icon: '🧴', sortOrder: 120 },
  { name: 'חד פעמי', icon: '🥤', sortOrder: 130 },
  { name: 'אחר', icon: '🛒', sortOrder: 999 },
];

export const SEED_ITEMS: SeedItem[] = [
  { name: 'עגבניות', categoryName: 'ירקות ופירות', defaultUnit: 'ק"ג' },
  { name: 'מלפפונים', categoryName: 'ירקות ופירות', defaultUnit: 'ק"ג' },
  { name: 'בצל', categoryName: 'ירקות ופירות', defaultUnit: 'ק"ג' },
  { name: 'תפוחי אדמה', categoryName: 'ירקות ופירות', defaultUnit: 'ק"ג' },
  { name: 'בננות', categoryName: 'ירקות ופירות', defaultUnit: 'ק"ג' },
  { name: 'תפוחים', categoryName: 'ירקות ופירות', defaultUnit: 'ק"ג' },
  { name: 'לימון', categoryName: 'ירקות ופירות', defaultUnit: 'יח׳' },
  { name: 'חסה', categoryName: 'ירקות ופירות', defaultUnit: 'יח׳' },

  { name: 'חלב', categoryName: 'מוצרי חלב וביצים', defaultUnit: 'ליטר' },
  { name: 'ביצים', categoryName: 'מוצרי חלב וביצים', defaultUnit: 'תבנית' },
  { name: 'גבינה צהובה', categoryName: 'מוצרי חלב וביצים', defaultUnit: 'גרם' },
  { name: 'גבינה לבנה', categoryName: 'מוצרי חלב וביצים', defaultUnit: 'יח׳' },
  { name: 'יוגורט', categoryName: 'מוצרי חלב וביצים', defaultUnit: 'יח׳' },
  { name: 'חמאה', categoryName: 'מוצרי חלב וביצים', defaultUnit: 'יח׳' },

  { name: 'חזה עוף', categoryName: 'בשר, עוף ודגים', defaultUnit: 'ק"ג' },
  { name: 'בשר טחון', categoryName: 'בשר, עוף ודגים', defaultUnit: 'ק"ג' },
  { name: 'נקניקיות', categoryName: 'בשר, עוף ודגים', defaultUnit: 'יח׳' },
  { name: 'פילה סלמון', categoryName: 'בשר, עוף ודגים', defaultUnit: 'ק"ג' },

  { name: 'לחם', categoryName: 'מאפים ולחם', defaultUnit: 'יח׳' },
  { name: 'פיתות', categoryName: 'מאפים ולחם', defaultUnit: 'חבילה' },
  { name: 'לחמניות', categoryName: 'מאפים ולחם', defaultUnit: 'חבילה' },

  { name: 'רסק עגבניות', categoryName: 'שימורים ורטבים', defaultUnit: 'יח׳' },
  { name: 'טונה', categoryName: 'שימורים ורטבים', defaultUnit: 'יח׳' },
  { name: 'תירס משומר', categoryName: 'שימורים ורטבים', defaultUnit: 'יח׳' },
  { name: 'מיונז', categoryName: 'שימורים ורטבים', defaultUnit: 'יח׳' },
  { name: 'קטשופ', categoryName: 'שימורים ורטבים', defaultUnit: 'יח׳' },

  { name: 'אורז', categoryName: 'יבשים, אורז ופסטה', defaultUnit: 'ק"ג' },
  { name: 'פסטה', categoryName: 'יבשים, אורז ופסטה', defaultUnit: 'חבילה' },
  { name: 'קוסקוס', categoryName: 'יבשים, אורז ופסטה', defaultUnit: 'חבילה' },
  { name: 'עדשים', categoryName: 'יבשים, אורז ופסטה', defaultUnit: 'חבילה' },

  { name: 'מלח', categoryName: 'תבלינים ואפייה', defaultUnit: 'יח׳' },
  { name: 'סוכר', categoryName: 'תבלינים ואפייה', defaultUnit: 'ק"ג' },
  { name: 'קמח', categoryName: 'תבלינים ואפייה', defaultUnit: 'ק"ג' },
  { name: 'שמן זית', categoryName: 'תבלינים ואפייה', defaultUnit: 'יח׳' },

  { name: 'ירקות קפואים', categoryName: 'קפואים', defaultUnit: 'חבילה' },
  { name: 'גלידה', categoryName: 'קפואים', defaultUnit: 'יח׳' },
  { name: 'שניצלים קפואים', categoryName: 'קפואים', defaultUnit: 'חבילה' },

  { name: 'מים מינרלים', categoryName: 'משקאות', defaultUnit: 'בקבוק' },
  { name: 'מיץ', categoryName: 'משקאות', defaultUnit: 'יח׳' },
  { name: 'קפה', categoryName: 'משקאות', defaultUnit: 'יח׳' },
  { name: 'תה', categoryName: 'משקאות', defaultUnit: 'קופסה' },

  { name: 'במבה', categoryName: 'חטיפים וממתקים', defaultUnit: 'יח׳' },
  { name: 'ביסלי', categoryName: 'חטיפים וממתקים', defaultUnit: 'יח׳' },
  { name: 'שוקולד', categoryName: 'חטיפים וממתקים', defaultUnit: 'יח׳' },
  { name: 'עוגיות', categoryName: 'חטיפים וממתקים', defaultUnit: 'חבילה' },

  { name: 'סבון כלים', categoryName: 'ניקיון לבית', defaultUnit: 'יח׳' },
  { name: 'אקונומיקה', categoryName: 'ניקיון לבית', defaultUnit: 'יח׳' },
  { name: 'נייר טואלט', categoryName: 'ניקיון לבית', defaultUnit: 'חבילה' },
  { name: 'מגבות נייר', categoryName: 'ניקיון לבית', defaultUnit: 'חבילה' },
  { name: 'שקיות אשפה', categoryName: 'ניקיון לבית', defaultUnit: 'חבילה' },

  { name: 'שמפו', categoryName: 'היגיינה וטיפוח', defaultUnit: 'יח׳' },
  { name: 'משחת שיניים', categoryName: 'היגיינה וטיפוח', defaultUnit: 'יח׳' },
  { name: 'סבון רחצה', categoryName: 'היגיינה וטיפוח', defaultUnit: 'יח׳' },

  { name: 'כוסות חד פעמי', categoryName: 'חד פעמי', defaultUnit: 'חבילה' },
  { name: 'צלחות חד פעמי', categoryName: 'חד פעמי', defaultUnit: 'חבילה' },
];
