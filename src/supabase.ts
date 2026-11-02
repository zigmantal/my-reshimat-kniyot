import { createClient } from '@supabase/supabase-js';

/**
 * הגדרות Supabase.
 * ה-URL וה-anon key הציבוריים בטוחים לשימוש בצד לקוח — ההרשאות האמיתיות
 * נאכפות ב-Row Level Security (RLS) בצד השרת (ראו supabase/schema.sql).
 *
 * אם תעבירו לפרויקט Supabase אחר, עדכנו את הערכים כאן או הגדירו אותם
 * כמשתני סביבה (ראו .env.example).
 */
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://pnvrmlowwxnmjrcvhylb.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_emGziNK542ZctXR6WXKtog_dGf9N24v';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithGoogle() {
  const redirectTo = window.location.origin;
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}
