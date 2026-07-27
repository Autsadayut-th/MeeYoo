# 🏠 MeeYoo - ระบบจัดการคลังของใช้ในบ้านแบบเรียลไทม์

**MeeYoo** คือเว็บแอปพลิเคชันจัดการสต็อกสินค้าและคลังของใช้ภายในบ้านแบบเรียลไทม์ ช่วยให้สมาชิกในบ้านเดียวกันสามารถติดตามสต็อก ดึงของใกล้หมด จัดการรายการซื้อของ และซิงค์ข้อมูลร่วมกันข้ามอุปกรณ์ได้อย่างมีประสิทธิภาพ

---

## 🎨 ฟีเจอร์หลัก (Key Features)

- ☕ **ธีมสี Warm Amber & Espresso:** ดีไซน์โทนสีอบอุ่น สบายตา รองรับทั้ง Light Mode และ Dark Mode
- 📦 **ระบบคลังสินค้าสต็อก:** ติดตามจำนวนสินค้า ป้ายเตือนใกล้หมด ⚠️ หรือหมดแล้ว 🔴 พร้อมปุ่มตัดสต็อกด่วน "ใช้ 1"
- ⏳ **ระบบติดตามวันหมดอายุ (Expiry Date Tracker):** แจ้งเตือนวันหมดอายุบนการ์ดสินค้าล่วงหน้า 7 วัน
- 🛒 **รายการซื้อของพร้อมงบประมาณ:** เพิ่มรายการของที่ต้องซื้อ ดึงรายการของใกล้หมดให้อัตโนมัติ พร้อมการ์ดประมาณการค่าใช้จ่ายรวม
- 📷 **สแกนบาร์โค้ด & อัปโหลดรูปภาพ:** สแกนบาร์โค้ดผ่านกล้อง และย่อขนาดรูปภาพสินค้าก่อนอัปโหลด
- 👥 **ระบบบ้านและอนุมัติสมาชิก:** สร้างบ้านหรือเข้าร่วมบ้านด้วยรหัสเชิญ (Invite Code) พร้อมระบบอนุมัติสมาชิกก่อนเข้าใช้งาน
- 📱 **รองรับ PWA (Installable App):** กดเพิ่มลงหน้าจอมือถือ iPhone / Android เพื่อใช้งานเหมือนแอปแท้ได้ทันที

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend:** React 18, Vite 5, TailwindCSS 3 (Glassmorphism UI)
- **Backend & Database:** Supabase Cloud (PostgreSQL), PostgREST REST API
- **Realtime Engine:** Supabase WebSockets (`postgres_changes`)
- **State Management:** React Context API (`AuthContext`, `HomeContext`) & Custom Hooks (`useStock`, `useShoppingList`, `useRealtime`)

---

## 🚀 การติดตั้งและเรียกใช้งาน (Getting Started)

1. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```

2. **รัน Dev Server:**
   ```bash
   npm run dev
   ```

3. **บิลด์สำหรับ Production:**
   ```bash
   npm run build
   ```

---

## 🗄️ การตั้งค่าฐานข้อมูล Supabase

รันคำสั่ง SQL ใน `supabase/migrations/001_initial_schema.sql` และ `supabase/migrations/002_household_scoped_rls.sql` ใน **SQL Editor** ของ Supabase Dashboard เพื่อเปิดใช้งานตารางและสิทธิ์ RLS ให้สมบูรณ์
