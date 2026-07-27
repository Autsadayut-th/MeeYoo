-- 1. PROFILES TABLE (เก็บโปรไฟล์ผู้ใช้)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. HOMES TABLE (เก็บข้อมูลบ้าน)
CREATE TABLE IF NOT EXISTS public.homes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    invite_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. HOME_MEMBERS TABLE (เก็บความสัมพันธ์สมาชิกในบ้าน)
CREATE TABLE IF NOT EXISTS public.home_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_id UUID REFERENCES public.homes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID NOT NULL,
    user_email TEXT DEFAULT '',
    user_name TEXT DEFAULT 'สมาชิก',
    role TEXT DEFAULT 'สมาชิก',
    status TEXT DEFAULT 'approved',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(home_id, user_id)
);

ALTER TABLE public.home_members ADD COLUMN IF NOT EXISTS user_email TEXT DEFAULT '';
ALTER TABLE public.home_members ADD COLUMN IF NOT EXISTS user_name TEXT DEFAULT 'สมาชิก';
ALTER TABLE public.home_members ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved';


-- 4. ITEMS TABLE (เก็บสต็อกสินค้า)
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_id UUID REFERENCES public.homes(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'ของใช้ส่วนตัว',
    quantity INT DEFAULT 1 CHECK (quantity >= 0),
    unit TEXT DEFAULT 'ชิ้น',
    min_threshold INT DEFAULT 1 CHECK (min_threshold >= 0),
    icon TEXT DEFAULT '📦',
    barcode TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. STOCK_TRANSACTIONS TABLE (เก็บประวัติกิจกรรม)
CREATE TABLE IF NOT EXISTS public.stock_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_id UUID REFERENCES public.homes(id) ON DELETE CASCADE NOT NULL,
    item_name TEXT NOT NULL,
    user_name TEXT NOT NULL,
    action_type TEXT NOT NULL,
    qty_before INT NOT NULL,
    qty_after INT NOT NULL,
    change_amount INT NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. SHOPPING_LIST TABLE (เก็บรายการซื้อของ)
CREATE TABLE IF NOT EXISTS public.shopping_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_id UUID REFERENCES public.homes(id) ON DELETE CASCADE NOT NULL,
    item_name TEXT NOT NULL,
    quantity_needed INT DEFAULT 1,
    is_purchased BOOLEAN DEFAULT FALSE,
    auto_added BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- เปิดใช้งาน RLS บนทุกตาราง
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list ENABLE ROW LEVEL SECURITY;

-- ลบ Policy เดิมก่อนเพื่อป้องกันการซ้ำซ้อน
DROP POLICY IF EXISTS "Allow public all access on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public all access on homes" ON public.homes;
DROP POLICY IF EXISTS "Allow public all access on home_members" ON public.home_members;
DROP POLICY IF EXISTS "Allow public all access on items" ON public.items;
DROP POLICY IF EXISTS "Allow public all access on stock_transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "Allow public all access on shopping_list" ON public.shopping_list;

-- สร้าง Policy ปลดล็อกสิทธิ์ให้แอป MeeYoo อ่าน/เขียน/ลบ ได้ 100%
CREATE POLICY "Allow public all access on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on homes" ON public.homes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on home_members" ON public.home_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on items" ON public.items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on stock_transactions" ON public.stock_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on shopping_list" ON public.shopping_list FOR ALL USING (true) WITH CHECK (true);

-- เปิดระบบ REALTIME ให้ตารางซิงค์สด (แบบปลอดภัย)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'items'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE items;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'stock_transactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE stock_transactions;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'shopping_list'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE shopping_list;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'home_members'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE home_members;
  END IF;
END $$;

