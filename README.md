# 🛒 רשימת קניות משפחתית

אפליקציית ווב (בעברית, RTL) לניהול רשימות קניות משותפות למשפחה: קטלוג
מוצרים קבוע ממוין לפי קטגוריות, יצירת רשימה חדשה מתוכו, פרסום שלה
לצפייה/עריכה חיה של כל בני המשפחה, וסימון פריטים כנרכשו.

נבנתה עם **React + TypeScript + Vite** ו-**Supabase** (Postgres + Auth +
Realtime) כ-backend. מיועדת לפיתוח/סנכרון דרך [Google AI
Studio](https://aistudio.google.com/apps).

## 🧱 ארכיטקטורה בקצרה

- **Auth**: התחברות עם Google, מוגבלת לרשימת מיילים סגורה (ראו למטה).
- **DB**: Supabase Postgres עם 4 טבלאות — `categories`, `catalog_items`,
  `lists`, `list_items`. ההרשאות נאכפות ב-Row Level Security: רק מי
  שהמייל שלו ברשימה המורשית יכול לקרוא/לכתוב.
- **Realtime**: עדכונים חיים על רשימות ופריטים (Supabase Realtime), כדי
  שכולם יראו שינויים מיידית.
- **4 מסכים**: התחברות, בית (רשימות פעילות/היסטוריה), צפייה ברשימה,
  יצירת רשימה חדשה.

פרטי ההחלטות המלאים (מה כן/לא נכנס ל-v1) נמצאים בשיחה שבה נבנה
הפרויקט — זה סיכום קצר:

- כל בן משפחה יכול להוסיף/לערוך פריטים וקטגוריות בקטלוג (קטלוג פתוח).
- רשימה שפורסמה היא משותפת ועריכה לכולם (לא read-only).
- סימון "נקנה" = קו חוצה, הפריט נשאר במקום (לא זז לסוף הרשימה).
- אין טיפול אופליין ואין התראות Push ב-v1.
- מחיקות (רשימה/פריט) פתוחות לכולם עם דיאלוג אישור בלבד, בלי סל מיחזור.

## ⚙️ הגדרה ראשונית (חד פעמי)

### 1. חיבור Google OAuth ב-Supabase

זה הצעד היחיד שלא ניתן לבצע אוטומטית וצריך לעשות ידנית בקונסולת
Supabase (וב-Google Cloud):

1. ב-[Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   צרו **OAuth client ID** מסוג "Web application".
2. כתובת ה-redirect שיש להוסיף שם:
   `https://pnvrmlowwxnmjrcvhylb.supabase.co/auth/v1/callback`
3. העתיקו את ה-Client ID וה-Client secret.
4. ב-[Supabase Dashboard](https://supabase.com/dashboard/project/pnvrmlowwxnmjrcvhylb/auth/providers) → Authentication → Providers → **Google** →
   הדביקו את הפרטים והפעילו (Enable).
5. תחת Authentication → URL Configuration, הוסיפו את הכתובת שבה
   תריצו/תפרסמו את האפליקציה (למשל כתובת ה-AI Studio preview, או
   `http://localhost:5173` לפיתוח מקומי) לרשימת ה-Redirect URLs.

### 2. רשימת בני המשפחה המורשים

ערכו **שני מקומות** (שניהם חייבים להיות מסונכרנים):

- `src/allowedMembers.ts` — משפיע על חוויית המשתמש בצד הלקוח.
- פונקציית ה-DB `is_family_member()` — האכיפה האמיתית. ניתן לערוך אותה
  ישירות ב-SQL editor של Supabase:

  ```sql
  create or replace function public.is_family_member()
  returns boolean
  language sql stable security definer set search_path = public
  as $$
    select coalesce(auth.jwt() ->> 'email', '') in (
      'zigman.tal@gmail.com',
      'spouse@example.com',
      'kid@example.com'
    );
  $$;
  ```

  (קובץ `supabase/schema.sql` מתעד את מצב הסכמה הנוכחי.)

### 3. משתני סביבה (לא חובה)

ברירות המחדל בקוד (`src/supabase.ts`) כבר מצביעות על פרויקט ה-Supabase
שהוקם. אם תרצו להשתמש בפרויקט אחר, העתיקו את `.env.example` ל-`.env.local`
ועדכנו את הערכים.

## 💻 פיתוח מקומי

```bash
npm install
npm run dev
```

האפליקציה תרוץ על `http://localhost:5173`. ודאו שכתובת זו נמצאת ברשימת
ה-Redirect URLs ב-Supabase (שלב 1 למעלה) כדי שההתחברות עם Google תעבוד.

## 🚀 סנכרון ל-Google AI Studio

1. פתחו את הפרויקט ב-[AI Studio Build](https://aistudio.google.com/apps)
   וסנכרנו אותו מול ריפו ה-GitHub הזה.
2. ודאו שכתובת ה-preview/deploy של AI Studio מתווספת ל-Redirect URLs
   ב-Supabase Auth, אחרת ההתחברות עם Google תיכשל שם.
3. אין build-time secrets נדרשים — ה-URL וה-anon key של Supabase גלויים
   מטבעם (מוגנים ע״י RLS), כך שהאפליקציה תעבוד "as-is" לאחר הסנכרון.

## 📁 מבנה הפרויקט

```
src/
  allowedMembers.ts   # רשימת מיילים מורשים (עריכה ידנית)
  supabase.ts         # לקוח Supabase + helpers להתחברות
  types.ts            # טיפוסי TypeScript התואמים לסכמה
  AuthContext.tsx      # מצב התחברות גלובלי
  App.tsx / main.tsx   # נתיבים (routing) ונקודת כניסה
  hooks/                # גישה לנתונים (כולל realtime)
  components/           # CatalogPicker, TopBar
  screens/              # 4 המסכים
supabase/
  schema.sql            # תיעוד הסכמה + RLS (כבר הוחל בפועל)
```

## 🗺️ רעיונות להמשך (לא ב-v1)

- העלאת תמונות אמיתיות למוצרים.
- התראות Push כשמתווסף פריט לרשימה פעילה.
- תמיכה אופליין מלאה.
- מסך ניהול בני משפחה (במקום עריכת קוד/SQL).
