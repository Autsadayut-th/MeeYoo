-- ========================================================
-- MeeYoo Household-Scoped RLS Security Migration
-- ========================================================

-- 1. Enable Row Level Security on all tables
ALTER TABLE public.homes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop legacy unrestricted policies
DROP POLICY IF EXISTS "Allow public all access on items" ON public.items;
DROP POLICY IF EXISTS "Allow public all access on homes" ON public.homes;
DROP POLICY IF EXISTS "Allow public all access on home_members" ON public.home_members;
DROP POLICY IF EXISTS "Allow public all access on stock_transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Allow public all access on shopping_list" ON public.shopping_list;
DROP POLICY IF EXISTS "Allow public all access on profiles" ON public.profiles;

-- 3. Create household-scoped security policies
CREATE POLICY "Allow household members full access on items"
ON public.items FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow household members full access on homes"
ON public.homes FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow household members full access on home_members"
ON public.home_members FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow household members full access on stock_transactions"
ON public.stock_transactions FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow household members full access on shopping_list"
ON public.shopping_list FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow full access on profiles"
ON public.profiles FOR ALL
USING (true)
WITH CHECK (true);
