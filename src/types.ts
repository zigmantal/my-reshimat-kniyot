export interface Category {
  id: string;
  name: string;
  sortOrder: number;
  icon: string | null;
  createdByEmail: string | null;
  createdAt: number; // epoch millis
}

export interface CatalogItem {
  id: string;
  name: string;
  categoryId: string | null;
  brandOrNote: string | null;
  defaultUnit: string | null;
  createdByEmail: string | null;
  createdAt: number;
}

export type ListStatus = 'active' | 'done';

export interface ShoppingList {
  id: string;
  title: string | null;
  status: ListStatus;
  createdByEmail: string | null;
  createdByName: string | null;
  createdAt: number;
  completedAt: number | null;
}

export interface ListItem {
  id: string;
  listId: string;
  catalogItemId: string | null;
  nameSnapshot: string;
  categoryId: string | null;
  categoryNameSnapshot: string | null;
  brandOrNote: string | null;
  quantity: number;
  unit: string | null;
  checked: boolean;
  addedByEmail: string | null;
  createdAt: number;
}
