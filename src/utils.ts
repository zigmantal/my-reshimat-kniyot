export function formatListTitle(list: { title: string | null; created_at: string; created_by_name: string | null }) {
  if (list.title && list.title.trim()) return list.title.trim();
  const date = new Date(list.created_at);
  const dateStr = date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
  const who = list.created_by_name ? ` — ${list.created_by_name}` : '';
  return `${dateStr}${who}`;
}

export function formatDateTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString('he-IL', {
    day: 'numeric',
    month: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
