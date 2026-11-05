/**
 * קובץ תבנית לרשימת המורשים.
 * העתיקו קובץ זה ל-src/allowedMembers.ts והוסיפו את כתובות ה-Gmail של בני המשפחה.
 */
export const ALLOWED_EMAILS: string[] = [
  'example@gmail.com',
];

export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ALLOWED_EMAILS.some(
    (allowed) => allowed.trim().toLowerCase() === email.trim().toLowerCase()
  );
}
