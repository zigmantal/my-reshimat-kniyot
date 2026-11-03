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
