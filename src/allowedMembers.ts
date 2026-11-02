/**
 * רשימת בני המשפחה המורשים להתחבר לאפליקציה.
 * ערכו ידנית כדי להוסיף/להסיר בן משפחה (כ-3 אנשים, אין צורך במסך ניהול).
 * חשוב: לאחר שינוי הקובץ יש לבנות (build) ולפרסם מחדש את האפליקציה.
 */
export const ALLOWED_EMAILS: string[] = [
  // דוגמה: 'name@gmail.com',
  'zigman.tal@gmail.com',
];

export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ALLOWED_EMAILS.some(
    (allowed) => allowed.trim().toLowerCase() === email.trim().toLowerCase()
  );
}
