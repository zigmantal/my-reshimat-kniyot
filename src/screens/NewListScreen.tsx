import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { useCatalogItems } from '../hooks/useCatalogItems';
import { useLists } from '../hooks/useLists';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabase';
import CatalogPicker from '../components/CatalogPicker';
import type { CatalogItem } from '../types';
import { formatListTitle } from '../utils';

interface StagedItem {
  item: CatalogItem;
  quantity: number;
}

export default function NewListScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories, addCategory } = useCategories();
  const { items, addItem } = useCatalogItems();
  const { lists: pastLists } = useLists('done');

  const [staged, setStaged] = useState<Map<string, StagedItem>>(new Map());
  const [title, setTitle] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [startFromOpen, setStartFromOpen] = useState(false);

  const email = user?.email ?? null;
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) || user?.email || null;

  function pick(item: CatalogItem) {
    setStaged((prev) => {
      const next = new Map(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.set(item.id, { item, quantity: 1 });
      }
      return next;
    });
  }

  function setQuantity(itemId: string, quantity: number) {
    setStaged((prev) => {
      const next = new Map(prev);
      const existing = next.get(itemId);
      if (existing) next.set(itemId, { ...existing, quantity: Math.max(1, quantity) });
      return next;
    });
  }

  async function startFromPastList(listId: string) {
    const { data } = await supabase.from('list_items').select('*').eq('list_id', listId);
    if (!data) return;
    setStaged((prev) => {
      const next = new Map(prev);
      for (const li of data as any[]) {
        if (!li.catalog_item_id) continue;
        const catalogItem = items.find((i) => i.id === li.catalog_item_id);
        if (!catalogItem) continue;
        next.set(catalogItem.id, { item: catalogItem, quantity: li.quantity || 1 });
      }
      return next;
    });
    setStartFromOpen(false);
  }

  async function publish() {
    if (staged.size === 0 || publishing) return;
    setPublishing(true);
    const { data: list, error } = await supabase
      .from('lists')
      .insert({
        title: title.trim() || null,
        status: 'active',
        created_by_email: email,
        created_by_name: displayName,
      })
      .select()
      .single();

    if (error || !list) {
      setPublishing(false);
      alert('שגיאה ביצירת הרשימה, נסו שוב');
      return;
    }

    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
    const rows = Array.from(staged.values()).map(({ item, quantity }) => ({
      list_id: list.id,
      catalog_item_id: item.id,
      name_snapshot: item.name,
      category_id: item.category_id,
      category_name_snapshot: item.category_id ? categoryMap.get(item.category_id) ?? null : null,
      brand_or_note: item.brand_or_note,
      quantity,
      unit: item.default_unit,
      added_by_email: email,
    }));

    await supabase.from('list_items').insert(rows);
    setPublishing(false);
    navigate(`/list/${list.id}`);
  }

  const stagedArray = Array.from(staged.values());

  return (
    <div className="new-list-screen">
      <h1>רשימה חדשה</h1>

      <input
        className="title-input"
        placeholder="שם לרשימה (לא חובה)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {pastLists.length > 0 && (
        <div className="start-from-past">
          {startFromOpen ? (
            <div className="inline-add-form">
              <select defaultValue="" onChange={(e) => e.target.value && startFromPastList(e.target.value)}>
                <option value="" disabled>
                  בחרו רשימה קודמת...
                </option>
                {pastLists.map((l) => (
                  <option key={l.id} value={l.id}>
                    {formatListTitle(l)}
                  </option>
                ))}
              </select>
              <button className="link-button" onClick={() => setStartFromOpen(false)}>
                ביטול
              </button>
            </div>
          ) : (
            <button className="secondary-button" onClick={() => setStartFromOpen(true)}>
              התחלה מרשימה קודמת
            </button>
          )}
        </div>
      )}

      {stagedArray.length > 0 && (
        <div className="staged-section">
          <h2>נבחרו ({stagedArray.length})</h2>
          <ul className="staged-list">
            {stagedArray.map(({ item, quantity }) => (
              <li key={item.id} className="staged-row">
                <span className="staged-name">{item.name}</span>
                <div className="quantity-control">
                  <button onClick={() => setQuantity(item.id, quantity - 1)}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(item.id, quantity + 1)}>+</button>
                  {item.default_unit && <span className="unit-label">{item.default_unit}</span>}
                </div>
                <button className="remove-button" onClick={() => pick(item)} aria-label="הסרה">
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <CatalogPicker
        categories={categories}
        items={items}
        onPick={pick}
        onCreateItem={(input) => addItem({ ...input, email })}
        onCreateCategory={(name) => addCategory(name, null, email)}
        pickedIds={new Set(staged.keys())}
      />

      <div className="publish-bar">
        <button
          className="primary-button publish-button"
          disabled={stagedArray.length === 0 || publishing}
          onClick={publish}
        >
          {publishing ? 'מפרסם...' : `פרסום (${stagedArray.length})`}
        </button>
      </div>
    </div>
  );
}
