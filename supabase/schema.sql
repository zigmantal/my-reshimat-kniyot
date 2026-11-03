-- סכמת מסד הנתונים עבור "רשימת קניות משפחתית".
-- קובץ זה הוא תיעוד/גיבוי — הסכמה כבר הוחלה בפועל על פרויקט ה-Supabase
-- (pnvrmlowwxnmjrcvhylb) דרך migrations. אם תרצו להקים פרויקט Supabase
-- חדש בעתיד, הריצו את הקובץ הזה ב-SQL editor של הפרויקט החדש.

-- פונקציית עזר: בודקת אם המשתמש המחובר נמצא ברשימת בני המשפחה המורשים.
-- *** ערכו את רשימת המיילים כאן בעת הוספה/הסרה של בן משפחה, ופרסמו מחדש. ***
create or replace function public.is_family_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt() ->> 'email', '') in (
    'zigman.tal@gmail.com'
    -- הוסיפו כאן מיילים נוספים של בני משפחה, מופרדים בפסיק, לדוגמה:
    -- , 'spouse@gmail.com'
    -- , 'kid@gmail.com'
  );
$$;

-- ===== קטגוריות =====
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order int not null default 0,
  icon text,
  created_by_email text,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "family can read categories" on public.categories for select using (public.is_family_member());
create policy "family can insert categories" on public.categories for insert with check (public.is_family_member());
create policy "family can update categories" on public.categories for update using (public.is_family_member()) with check (public.is_family_member());
create policy "family can delete categories" on public.categories for delete using (public.is_family_member());

-- ===== קטלוג מוצרים קבוע =====
create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_id uuid references public.categories(id) on delete set null,
  brand_or_note text,
  default_unit text,
  created_by_email text,
  created_at timestamptz not null default now()
);

create index if not exists catalog_items_category_id_idx on public.catalog_items(category_id);
alter table public.catalog_items enable row level security;

create policy "family can read catalog_items" on public.catalog_items for select using (public.is_family_member());
create policy "family can insert catalog_items" on public.catalog_items for insert with check (public.is_family_member());
create policy "family can update catalog_items" on public.catalog_items for update using (public.is_family_member()) with check (public.is_family_member());
create policy "family can delete catalog_items" on public.catalog_items for delete using (public.is_family_member());

-- ===== רשימות קניות =====
create table if not exists public.lists (
  id uuid primary key default gen_random_uuid(),
  title text,
  status text not null default 'active' check (status in ('active', 'done')),
  created_by_email text,
  created_by_name text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.lists enable row level security;

create policy "family can read lists" on public.lists for select using (public.is_family_member());
create policy "family can insert lists" on public.lists for insert with check (public.is_family_member());
create policy "family can update lists" on public.lists for update using (public.is_family_member()) with check (public.is_family_member());
create policy "family can delete lists" on public.lists for delete using (public.is_family_member());

-- ===== פריטים בתוך רשימה =====
create table if not exists public.list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.lists(id) on delete cascade,
  catalog_item_id uuid references public.catalog_items(id) on delete set null,
  name_snapshot text not null,
  category_id uuid references public.categories(id) on delete set null,
  category_name_snapshot text,
  brand_or_note text,
  quantity int not null default 1,
  unit text,
  checked boolean not null default false,
  added_by_email text,
  created_at timestamptz not null default now()
);

create index if not exists list_items_list_id_idx on public.list_items(list_id);
alter table public.list_items enable row level security;

create policy "family can read list_items" on public.list_items for select using (public.is_family_member());
create policy "family can insert list_items" on public.list_items for insert with check (public.is_family_member());
create policy "family can update list_items" on public.list_items for update using (public.is_family_member()) with check (public.is_family_member());
create policy "family can delete list_items" on public.list_items for delete using (public.is_family_member());

-- ===== Realtime =====
alter publication supabase_realtime add table public.lists;
alter publication supabase_realtime add table public.list_items;
