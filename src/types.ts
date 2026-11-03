export interface Category {
  id: string;
  name: string;
  sort_order: number;
  icon: string | null;
  created_by_email: string | null;
  created_at: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  category_id: string | null;
  brand_or_note: string | null;
  default_unit: string | null;
  created_by_email: string | null;
  created_at: string;
}

export type ListStatus = 'active' | 'done';

export interface ShoppingList {
  id: string;
  title: string | null;
  status: ListStatus;
  created_by_email: string | null;
  created_by_name: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface ListItem {
  id: string;
  list_id: string;
  catalog_item_id: string | null;
  name_snapshot: string;
  category_id: string | null;
  category_name_snapshot: string | null;
  brand_or_note: string | null;
  quantity: number;
  unit: string | null;
  checked: boolean;
  added_by_email: string | null;
  created_at: string;
}
