export function formatListTitle(list: { title: string | null; createdAt: number; createdByName: string | null }) {
  if (list.title && list.title.trim()) return list.title.trim();
  const date = new Date(list.createdAt);
  const dateStr = date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
  const who = list.createdByName ? ` — ${list.createdByName}` : '';
  return `${dateStr}${who}`;
}

export function formatDateTime(millis: number) {
  const date = new Date(millis);
  return date.toLocaleString('he-IL', {
    day: 'numeric',
    month: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface WhatsappListItem {
  nameSnapshot: string;
  quantity: number;
  unit: string | null;
  checked: boolean;
  categoryNameSnapshot: string | null;
}

/**
 * בניית טקסט פשוט (WhatsApp plain text, עם עיצוב WhatsApp כגון *מודגש*
 * ו-~קו חוצה~) המייצג רשימת קניות, לשיתוף מהיר ב-WhatsApp.
 */
export function buildWhatsappListText(
  list: { title: string | null; createdAt: number; createdByName: string | null },
  items: WhatsappListItem[]
): string {
  const lines: string[] = [];
  lines.push(`🛒 *${formatListTitle(list)}*`);
  lines.push('');

  const grouped = new Map<string, WhatsappListItem[]>();
  for (const item of items) {
    const key = item.categoryNameSnapshot || 'אחר';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  }

  for (const [categoryName, categoryItems] of grouped.entries()) {
    lines.push(`*${categoryName}*`);
    for (const item of categoryItems) {
      const qty = item.quantity > 1 ? ` x${item.quantity}` : '';
      const unit = item.unit ? ` ${item.unit}` : '';
      const line = `• ${item.nameSnapshot}${qty}${unit}`;
      lines.push(item.checked ? `~${line}~` : line);
    }
    lines.push('');
  }

  lines.push('נשלח מתוך רשימת קניות משפחתית 🛒');
  return lines.join('\n').trim();
}

/** בניית קישור לשיתוף טקסט ב-WhatsApp (פותח את אפליקציית/אתר WhatsApp עם הטקסט ממולא מראש). */
export function buildWhatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
