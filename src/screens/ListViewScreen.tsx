import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useListDetail } from '../hooks/useListDetail';
import { useCategories } from '../hooks/useCategories';
import { useCatalogItems } from '../hooks/useCatalogItems';
import { useAuth } from '../AuthContext';
import CatalogPicker from '../components/CatalogPicker';
import { formatListTitle, formatDateTime, buildWhatsappListText, buildWhatsappShareUrl } from '../utils';
import type { CatalogItem } from '../types';

export default function ListViewScreen() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { list, items, loading, toggleChecked, removeItem, addQuickItem, markDone, deleteList } =
    useListDetail(listId);
  const { categories, addCategory } = useCategories();
  const { items: catalogItems, addItem } = useCatalogItems();
  const [addingOpen, setAddingOpen] = useState(false);
  const [quickText, setQuickText] = useState('');
  const [quickAdding, setQuickAdding] = useState(false);

  const email = user?.email ?? null;

  const grouped = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const li of items) {
      const key = li.categoryNameSnapshot || 'אחר';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(li);
    }
    return Array.from(map.entries());
  }, [items]);

  if (loading) {
    return (
      <div className="centered-screen small">
        <div className="spinner" />
      </div>
    );
  }

  if (!list) {
    return (
      <div className="empty-state">
        <p>הרשימה לא נמצאה.</p>
      </div>
    );
  }

  const isDone = list.status === 'done';
  const pickedIds = new Set(items.filter((i) => i.catalogItemId).map((i) => i.catalogItemId!));

  async function handlePick(item: CatalogItem) {
    if (!listId) return;
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
    await addQuickItem({
      listId,
      nameSnapshot: item.name,
      categoryId: item.categoryId,
      categoryNameSnapshot: item.categoryId ? categoryMap.get(item.categoryId) ?? null : null,
      catalogItemId: item.id,
      brandOrNote: item.brandOrNote,
      quantity: 1,
      unit: item.defaultUnit,
      email,
    });
  }

  async function handleQuickAdd() {
    const name = quickText.trim();
    if (!name || !listId || quickAdding) return;
    setQuickAdding(true);
    try {
      const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
      // חיפוש פריט קיים בקטלוג עם אותו שם (ללא תלות ברישיות), כדי לא
      // ליצור כפילויות אם הפריט כבר קיים
      const existing = catalogItems.find((i) => i.name.trim().toLowerCase() === name.toLowerCase());
      const catalogItem = existing ?? (await addItem({ name, categoryId: null, email }));
      if (!catalogItem) return;

      await addQuickItem({
        listId,
        nameSnapshot: catalogItem.name,
        categoryId: catalogItem.categoryId,
        categoryNameSnapshot: catalogItem.categoryId ? categoryMap.get(catalogItem.categoryId) ?? null : null,
        catalogItemId: catalogItem.id,
        brandOrNote: catalogItem.brandOrNote,
        quantity: 1,
        unit: catalogItem.defaultUnit,
        email,
      });
      setQuickText('');
    } finally {
      setQuickAdding(false);
    }
  }

  async function handleMarkDone() {
    if (confirm('לסמן את הרשימה כהושלמה?')) {
      await markDone();
    }
  }

  async function handleDeleteList() {
    if (confirm('למחוק את הרשימה הזו לצמיתות?')) {
      await deleteList();
      navigate('/');
    }
  }

  function handleShareWhatsapp() {
    const text = buildWhatsappListText(list!, items);
    window.open(buildWhatsappShareUrl(text), '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="list-view-screen">
      <div className="list-view-header">
        <div>
          <h1>{formatListTitle(list)}</h1>
          <p className="list-view-meta">
            {list.createdByName ? `נוצרה ע״י ${list.createdByName} · ` : ''}
            {formatDateTime(list.createdAt)}
          </p>
        </div>
        {isDone && <span className="badge badge-done">הושלם</span>}
      </div>

      <button className="secondary-button whatsapp-share-button" onClick={handleShareWhatsapp}>
        📤 שיתוף ב-WhatsApp
      </button>

      {grouped.length === 0 ? (
        <div className="empty-state">
          <p>אין עדיין פריטים ברשימה.</p>
        </div>
      ) : (
        grouped.map(([categoryName, categoryItems]) => (
          <section key={categoryName} className="list-category-group">
            <h3 className="list-category-title">{categoryName}</h3>
            <ul className="shopping-items">
              {categoryItems.map((li) => (
                <li key={li.id} className={`shopping-item ${li.checked ? 'shopping-item-checked' : ''}`}>
                  <label className="shopping-item-label">
                    <input
                      type="checkbox"
                      checked={li.checked}
                      disabled={isDone}
                      onChange={(e) => toggleChecked(li.id, e.target.checked)}
                    />
                    <span className="shopping-item-name">
                      {li.nameSnapshot}
                      {li.quantity > 1 && <span className="qty-badge">× {li.quantity}</span>}
                      {li.unit && <span className="unit-badge">{li.unit}</span>}
                    </span>
                    {li.brandOrNote && <span className="item-note">{li.brandOrNote}</span>}
                  </label>
                  {!isDone && (
                    <button
                      className="remove-button"
                      aria-label="הסרה"
                      onClick={() => removeItem(li.id)}
                    >
                      ✕
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      {!isDone && (
        <>
          <div className="quick-add-row">
            <input
              type="text"
              className="quick-add-input"
              placeholder="הוספה מהירה — הקלידו שם פריט..."
              value={quickText}
              onChange={(e) => setQuickText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleQuickAdd();
                }
              }}
            />
            <button
              className="primary-button small"
              onClick={handleQuickAdd}
              disabled={!quickText.trim() || quickAdding}
            >
              הוספה
            </button>
          </div>

          {addingOpen ? (
            <div className="add-item-panel">
              <div className="add-item-panel-header">
                <h2>הוספת פריט</h2>
                <button className="link-button" onClick={() => setAddingOpen(false)}>
                  סגירה
                </button>
              </div>
              <CatalogPicker
                categories={categories}
                items={catalogItems}
                onPick={handlePick}
                onCreateItem={(input) => addItem({ ...input, email })}
                onCreateCategory={(name) => addCategory(name, null, email)}
                pickedIds={pickedIds}
              />
            </div>
          ) : (
            <button className="secondary-button add-item-trigger" onClick={() => setAddingOpen(true)}>
              עיון בקטלוג המלא
            </button>
          )}

          <div className="list-actions">
            <button className="primary-button" onClick={handleMarkDone}>
              סימון כהושלם
            </button>
            <button className="danger-link" onClick={handleDeleteList}>
              מחיקת רשימה
            </button>
          </div>
        </>
      )}
    </div>
  );
}
