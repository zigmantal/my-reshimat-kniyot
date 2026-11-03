# 🛒 רשימת קניות משפחתית

אפליקציית ווב (בעברית, RTL) לניהול רשימות קניות משותפות למשפחה: קטלוג
מוצרים קבוע ממוין לפי קטגוריות, יצירת רשימה חדשה מתוכו, פרסום שלה
לצפייה/עריכה חיה של כל בני המשפחה, וסימון פריטים כנרכשו.

נבנתה עם **React + TypeScript + Vite** ו-**Firebase** (Firestore + Auth)
כ-backend, במבנה שתואם איך ש-[Google AI Studio](https://aistudio.google.com/apps)
בונה ומריץ אפליקציות (אותו דפוס בדיוק שעבד "מהקופסה" באפליקציה קודמת
שבניתם שם — התחברות Google ללא שום הגדרת OAuth ידנית).

## 🧱 ארכיטקטורה בקצרה

- **Auth**: התחברות עם Google (Firebase Auth), מוגבלת לרשימת מיילים
  סגורה של בני המשפחה (ראו למטה). ב-Firebase, Google Sign-In מופעל
  כברירת מחדל ברוב הפרויקטים שנוצרים דרך AI Studio — בניגוד ל-OAuth
  providers חיצוניים שדורשים הגדרה ידנית.
- **DB**: Firestore עם 3 אוספים (collections) בשורש — `categories`,
  `catalogItems`, `lists` — ותת-אוסף `items` בתוך כל רשימה
  (`lists/{listId}/items/{itemId}`).
- **הרשאות**: נאכפות ב-Firestore Security Rules (`firestore.rules`) —
  רק מי שהמייל שלו ברשימה המורשית יכול לקרוא/לכתוב.
- **עדכונים חיים**: Firestore `onSnapshot` על רשימות ופריטים, כך שכל
  בני המשפחה רואים שינויים מיידית.
- **4 מסכים**: התחברות, בית (רשימות פעילות/היסטוריה), צפייה ברשימה,
  יצירת רשימה חדשה.
- **זריעת נתונים**: בפעם הראשונה שמישהו מתחבר ואוסף ה-`categories` ריק,
  האפליקציה מזריעה אוטומטית ~14 קטגוריות ו-~55 מוצרים נפוצים
  (`src/seedDatabase.ts`). לא קורה שוב לאחר מכן.

החלטות העיצוב המלאות (מה כן/לא נכנס ל-v1) נמצאות בשיחה שבה נבנה
הפרויקט — זה סיכום קצר:

- כל בן משפחה יכול להוסיף/לערוך פריטים וקטגוריות בקטלוג (קטלוג פתוח).
- רשימה שפורסמה היא משותפת ועריכה לכולם (לא read-only).
- סימון "נקנה" = קו חוצה, הפריט נשאר במקום (לא זז לסוף הרשימה).
- אין טיפול אופליין ואין התראות Push ב-v1.
- מחיקות (רשימה/פריט) פתוחות לכולם עם דיאלוג אישור בלבד, בלי סל מיחזור.

## ⚙️ הגדרה ראשונית

### 1. חיבור ל-Firebase דרך AI Studio

פתחו את הפרויקט ב-[AI Studio Build](https://aistudio.google.com/apps)
וסנכרנו אותו מול ריפו ה-GitHub הזה. כשתשתמשו שם בתכונה שדורשת
backend (Auth/Firestore), AI Studio אמור **ליצור פרויקט Firebase
אוטומטית** ולהחליף את `firebase-applet-config.json` (שכרגע מכיל ערכי
placeholder) בערכים האמיתיים — בדיוק כמו שקרה באפליקציה הקודמת שלכם.

אם זה לא קורה אוטומטית, אפשר גם ידנית:
1. [Firebase Console](https://console.firebase.google.com/) → Add project.
2. Build → Authentication → Sign-in method → הפעילו **Google** (בד״כ
   צעד של לחיצה אחת, בלי הגדרת OAuth client נפרד).
3. Build → Firestore Database → צרו מסד נתונים.
4. Project settings → הוסיפו Web App → העתיקו את אובייקט ה-config
   ל-`firebase-applet-config.json` בשורש הריפו.

### 2. פרסום Firestore Security Rules

**זה צעד חובה** — בלעדיו אף אחד לא יוכל לקרוא/לכתוב נתונים (או שכולם
יוכלו, תלוי בברירת המחדל). ב-Firebase Console → Firestore Database →
Rules, הדביקו את תוכן הקובץ `firestore.rules` ולחצו Publish.

### 3. רשימת בני המשפחה המורשים

ערכו **שני מקומות** (שניהם חייבים להיות מסונכרנים):

- `src/allowedMembers.ts` — משפיע על חוויית המשתמש בצד הלקוח.
- `firestore.rules` (הפונקציה `isFamilyMember()`) — האכיפה האמיתית
  בצד השרת. אחרי עריכה יש לפרסם מחדש (Publish) ב-Firebase Console.

## 💻 פיתוח מקומי

```bash
npm install
npm run dev
```

האפליקציה תרוץ על `http://localhost:5173`. ודאו ש-`firebase-applet-config.json`
מכיל ערכי פרויקט אמיתיים (לא placeholder) לפני הרצה מקומית, אחרת
ההתחברות/הנתונים לא יעבדו.

## 📁 מבנה הפרויקט

```
firebase-applet-config.json   # הגדרות פרויקט Firebase (מוחלף אוטומטית ע״י AI Studio)
firestore.rules               # כללי אבטחה — הדביקו ל-Firebase Console
src/
  allowedMembers.ts    # רשימת מיילים מורשים (עריכה ידנית, צד לקוח)
  firebase.ts          # לקוח Firebase (Auth + Firestore) + helpers להתחברות
  seedData.ts           # תוכן הזריעה (קטגוריות + מוצרים)
  seedDatabase.ts        # לוגיקת הזריעה החד-פעמית
  types.ts              # טיפוסי TypeScript
  AuthContext.tsx        # מצב התחברות גלובלי
  App.tsx / main.tsx     # נתיבים (routing) ונקודת כניסה
  hooks/                  # גישה לנתונים (Firestore, כולל realtime)
  components/             # CatalogPicker, TopBar
  screens/                # 4 המסכים
```

## 🗺️ רעיונות להמשך (לא ב-v1)

- העלאת תמונות אמיתיות למוצרים.
- התראות Push כשמתווסף פריט לרשימה פעילה.
- תמיכה אופליין מלאה (קל להוסיף עם Firestore persistence אם תרצו).
- מסך ניהול בני משפחה (במקום עריכת קוד).
