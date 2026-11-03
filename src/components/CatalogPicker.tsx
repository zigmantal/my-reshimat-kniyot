import { useMemo, useState } from 'react';
import type { Category, CatalogItem } from '../types';

interface Props {
  categories: Category[];
  items: CatalogItem[];
  onPick: (item: CatalogItem) => void;
  onCreateItem: (input: {
    name: string;
    categoryId: string | null;
    brandOrNote?: string | null;
    defaultUnit?: string | null;
  }) => Promise<CatalogItem | null>;
  onCreateCategory: (name: string) => Promise<Category | null>;
  /** פריטים שכבר נבחרו (להצגת סימון "נוסף") */
  pickedIds?: Set<string>;
}

export default function CatalogPicker({
  categories,
  items,
  onPick,
  onCreateItem,
  onCreateCategory,
  pickedIds,
}: Props) {
  const [query, setQuery] = useState('');
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemNote, setNewItemNote] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const itemsByCategory = useMemo(() => {
    const map = new Map<string | null, CatalogItem[]>();
    const q = query.trim().toLowerCase();
    for (const item of items) {
      if (q && !item.name.toLowerCase().includes(q)) continue;
      const key = item.categoryId;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return map;
  }, [items, query]);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder),
    [categories]
  );

  async function submitNewItem(categoryId: string | null) {
    const name = newItemName.trim();
    if (!name) return;
    const created = await onCreateItem({
      name,
      categoryId,
      brandOrNote: newItemNote.trim() || null,
    });
    if (created) onPick(created);
    setNewItemName('');
    setNewItemNote('');
    setAddingToCategory(null);
  }

  async function submitNewCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    await onCreateCategory(name);
    setNewCategoryName('');
    setAddingCategory(false);
  }

  return (
    <div className="catalog-picker">
      <input
        className="search-input"
        type="text"
        placeholder="חיפוש מוצר..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {sortedCategories.map((cat) => {
        const catItems = itemsByCategory.get(cat.id) || [];
        if (query && catItems.length === 0) return null;
        return (
          <section key={cat.id} className="picker-category">
            <h3 className="picker-category-title">
              <span className="cat-icon">{cat.icon}</span> {cat.name}
            </h3>
            <div className="picker-items">
              {catItems.map((item) => {
                const picked = pickedIds?.has(item.id);
                return (
                  <button
                    key={item.id}
                    className={`picker-item ${picked ? 'picker-item-picked' : ''}`}
                    onClick={() => onPick(item)}
                  >
                    <span>{item.name}</span>
                    {item.brandOrNote && (
                      <span className="picker-item-note">{item.brandOrNote}</span>
                    )}
                    <span className="picker-item-add">{picked ? '✓' : '+'}</span>
                  </button>
                );
              })}

              {addingToCategory === cat.id ? (
                <div className="inline-add-form">
                  <input
                    autoFocus
                    placeholder="שם המוצר"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                  <input
                    placeholder="הערה / מותג (לא חובה)"
                    value={newItemNote}
                    onChange={(e) => setNewItemNote(e.target.value)}
                  />
                  <div className="inline-add-actions">
                    <button className="primary-button small" onClick={() => submitNewItem(cat.id)}>
                      הוספה לקטלוג
                    </button>
                    <button className="link-button" onClick={() => setAddingToCategory(null)}>
                      ביטול
                    </button>
                  </div>
                </div>
              ) : (
                <button className="picker-add-new" onClick={() => setAddingToCategory(cat.id)}>
                  + מוצר חדש בקטגוריה זו
                </button>
              )}
            </div>
          </section>
        );
      })}

      {!query && (
        <section className="picker-category">
          {addingCategory ? (
            <div className="inline-add-form">
              <input
                autoFocus
                placeholder="שם קטגוריה חדשה"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <div className="inline-add-actions">
                <button className="primary-button small" onClick={submitNewCategory}>
                  הוספת קטגוריה
                </button>
                <button className="link-button" onClick={() => setAddingCategory(false)}>
                  ביטול
                </button>
              </div>
            </div>
          ) : (
            <button className="picker-add-new" onClick={() => setAddingCategory(true)}>
              + קטגוריה חדשה
            </button>
          )}
        </section>
      )}
    </div>
  );
}
