# 📦 MeeYoo - 2-User Realtime Household Inventory App

**MeeYoo** คือเว็บแอพพลิเคชันสำหรับจัดการคลังของใช้ภายในบ้าน ออกแบบมาเพื่อให้คน 2 คนที่อยู่บ้านเดียวกันสามารถใช้งานและแชร์ข้อมูลคลังของร่วมกันได้แบบ **Real-time**

---

## 🌟 ฟีเจอร์หลัก (Features)

* **🏠 Dashboard ภาพรวม**: สรุปจำนวนสินค้าทั้งหมด, สินค้าใกล้หมด `⚠️`, สินค้าหมด `🔴`, รายการซื้อ `🛒`
* **📦 ระบบ Stock**: จัดเก็บชื่อ, รูปภาพ/ไอคอน, หมวดหมู่, จำนวนคงเหลือ, หน่วยนับ (ชิ้น/ขวด/กล่อง/กระปุก/ก้อน), จำนวนขั้นต่ำ
* **⚡ ปุ่มกดใช้งานด่วน "ใช้ 1"**: กดปุ่มเดียวเพื่อลดจำนวนลง 1 ชิ้นทันที (เช่น ยาสระผม 2 → 1) ข้อมูลอัปเดตแบบ Realtime ทันที
* **📜 บันทึกประวัติการใช้งาน (History Log)**: บันทึกว่าใครเป็นคนทำรายการ (User 1 หรือ User 2), จำนวนก่อนเปลี่ยน $\rightarrow$ หลังเปลี่ยน, วันเวลา
* **⚠️ ระบบแจ้งเตือนของใกล้หมด & หมดแล้ว**: 
  * สีปกติ = มีของเพียงพอ (`#10b981`)
  * สีเหลือง = `⚠️ ใกล้หมด` (`#f59e0b`)
  * สีแดง = `🔴 หมดแล้ว` (`#f43f5e`)
* **🛒 Shopping List**: ดึงรายการของใกล้หมดเข้าลิสต์ซื้อของอัตโนมัติ พร้อมปุ่ม "ซื้อแล้ว" และปุ่ม "เติมเข้า Stock" (0 → 2)
* **👥 ระบบบ้านและคำเชิญ (Members)**: แชร์ Invitation Code (เช่น `HOME-8829`) และ Invitation Link ให้สมาชิกร่วมบ้าน

---

## 🗄️ Database Schema (PostgreSQL DDL สำหรับ Supabase)

นำคำสั่งด้านล่างไปรันใน **SQL Editor** บน Supabase Dashboard:

```sql
-- 1. PROFILES TABLE
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. HOMES TABLE (บ้านสำหรับ 2 สมาชิก)
CREATE TABLE public.homes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    invite_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. HOME_MEMBERS TABLE (ตารางความสัมพันธ์)
CREATE TABLE public.home_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_id UUID REFERENCES public.homes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(home_id, user_id)
);

-- 4. ITEMS TABLE (สต็อกสินค้า)
CREATE TABLE public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_id UUID REFERENCES public.homes(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'ของใช้ส่วนตัว',
    quantity INT DEFAULT 1 CHECK (quantity >= 0),
    unit TEXT DEFAULT 'ชิ้น',
    min_threshold INT DEFAULT 1 CHECK (min_threshold >= 0),
    icon TEXT DEFAULT '📦',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. STOCK_TRANSACTIONS TABLE (ประวัติกิจกรรม)
CREATE TABLE public.stock_transactions (
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

-- 6. SHOPPING_LIST TABLE (รายการซื้อของ)
CREATE TABLE public.shopping_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_id UUID REFERENCES public.homes(id) ON DELETE CASCADE NOT NULL,
    item_name TEXT NOT NULL,
    quantity_needed INT DEFAULT 1,
    is_purchased BOOLEAN DEFAULT FALSE,
    auto_added BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- REALTIME PUBLICATION
ALTER PUBLICATION supabase_realtime ADD TABLE items, stock_transactions, shopping_list;
```

---

## 🚀 วิธีการทดสอบและเปิดใช้งาน

### วิธีที่ 1: เปิดใช้งานผ่าน Web Browser ทันที
1. ดับเบิ้ลคลิกเปิดไฟล์ [index.html](file:///c:/Users/E320/Downloads/Project/MeeYoo/index.html) ใน Web Browser (เช่น Chrome, Edge)
2. สังเกตปุ่ม **สลับทดสอบ: 👤 User 1 (สมชาย) | 👩‍🎨 User 2 (สมหญิง)** ที่มุมขวาบน
3. ทดลองเปิด 2 แท็บพร้อมกัน และกดปุ่ม **"ใช้ 1"** ในแท็บแรก ➔ แท็บที่สองจะซิงค์ข้อมูลลดลง 1 ชิ้นทันทีแบบ **Real-time**!

### วิธีที่ 2: Deploy ขึ้น Vercel
1. อัปโหลดโค้ดขึ้น GitHub Repository
2. เข้าไปที่ [Vercel Dashboard](https://vercel.com) และกด **New Project**
3. เลือก Repository แล้วกด **Deploy** ได้ทันที!
