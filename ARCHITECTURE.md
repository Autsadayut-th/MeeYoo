# 🧠 MeeYoo Architecture & Directory Responsibilities

เอกสารอธิบายหน้าที่การทำงานของแต่ละโฟลเดอร์และไฟล์ในโปรเจกต์ **MeeYoo**

---

## 📐 การแบ่งหน้าที่หลัก (Separation of Concerns)

```
MeeYoo/
├── pages/         # 📱 หน้าจอหลักที่ผู้ใช้เห็น (View Layer)
├── components/    # 🧩 ชิ้นส่วน UI ที่นำกลับมาใช้ซ้ำ (UI Components)
├── services/      # ☁️ ติดต่อ Supabase API / Database (Data Access Layer)
├── hooks/         # 🪝 จัดการ Logic และ State (Custom Hooks)
├── context/       # 🌐 ข้อมูลที่ใช้ร่วมกันทั้งแอพ (Global State Provider)
├── utils/         # 🛠️ ฟังก์ชันช่วยเหลือและค่าคงที่ (Helper Functions & Constants)
└── supabase/      # 🗄️ โครงสร้างฐานข้อมูล (SQL Schemas & Seed Data)
```

---

## 📁 รายละเอียดหน้าที่ของแต่ละโฟลเดอร์และไฟล์

### 1. `src/pages/` (View Layer - หน้าจอที่ผู้ใช้เห็น)
- **`Dashboard.jsx`**: หน้าจอภาพรวม แสดงการ์ดสรุปสถิติ (สินค้าทั้งหมด, ใกล้หมด ⚠️, หมดแล้ว 🔴, รายการซื้อ 🛒) และรายการสินค้าด่วน
- **`Stock.jsx`**: หน้าจัดการสต็อกสินค้าแบบ Card Layout พร้อมช่องค้นหาและตัวกรองหมวดหมู่
- **`ShoppingList.jsx`**: หน้าเช็คลิสต์รายการที่ต้องซื้อ พร้อมปุ่ม "ซื้อแล้ว" และปุ่ม "เติมเข้า Stock"
- **`History.jsx`**: หน้าแสดงประวัติกิจกรรมย้อนหลัง (ใครทำอะไร, จำนวนก่อน $\rightarrow$ หลัง, เวลา)
- **`Members.jsx`**: หน้าแสดงข้อมูลบ้านและสมาชิกร่วมบ้าน พร้อมปุ่มคัดลอกรหัสเชิญ / ลิงก์เชิญ
- **`Settings.jsx`**: หน้าตั้งค่าโปรไฟล์ การเชื่อมต่อ Supabase URL / Anon Key และตัวดูคำสั่ง SQL
- **`CreateHome.jsx` / `JoinHome.jsx`**: หน้าสร้างบ้านใหม่ หรือใส่รหัสเพื่อ เข้าร่วมบ้านเดียวกัน
- **`auth/Login.jsx` / `Register.jsx`**: หน้าจอเข้าสู่ระบบและลงทะเบียน

---

### 2. `src/components/` (UI Components Layer - ชิ้นส่วน UI Reusable)

#### `common/` (องค์ประกอบ UI ทั่วไป)
- **`Button.jsx`**: ปุ่มกดมาตรฐาน รองรับหลาย Variant (`primary`, `emerald`, `amber`, `danger`, `ghost`)
- **`Modal.jsx`**: หน้าต่างป๊อปอัพ Modal แสดงผลแบบ Glassmorphism
- **`Input.jsx`**: ช่องกรอกข้อมูล Text / Number Input
- **`Loading.jsx`**: ตัวแสดงสถานะกำลังโหลดข้อมูล (Spinner)
- **`EmptyState.jsx`**: การ์ดแสดงผลเมื่อไม่มีข้อมูล (Empty State)
- **`ConfirmDialog.jsx`**: หน้าต่างยืนยันก่อนทำรายการ ( Confirm Modal )

#### `layout/` (โครงสร้างเลย์เอาต์)
- **`Navbar.jsx`**: แถบด้านบน แสดงชื่อบ้าน รหัสบ้าน และปุ่มสลับ User 1 / User 2
- **`Sidebar.jsx`**: แถบเมนูด้านข้างสำหรับหน้าจอ Desktop
- **`MobileNavbar.jsx`**: แถบเมนูด้านล่าง (Bottom Navigation Bar) สำหรับจอมือถือ
- **`AppLayout.jsx`**: Master Layout ห่อหุ้มโครงสร้างหน้าจอทั้งหมด

#### `stock/` (ชิ้นส่วน UI สำหรับสต็อก)
- **`StockCard.jsx`**: การ์ดแสดงรายการสินค้า ปุ่ม "ใช้ 1" และปุ่ม + / -
- **`StockList.jsx`**: รายการรวมการ์ดสินค้า
- **`StockStatusBadge.jsx`**: ป้ายแสดงสถานะ (ปกติ, ⚠️ ใกล้หมด, 🔴 หมดแล้ว)

#### `dashboard/` (ชิ้นส่วน UI สำหรับแดชบอร์ด)
- **`SummaryCard.jsx`**: การ์ดแสดงตัวเลขสถิติต่างๆ ในหน้าภาพรวม

#### `shopping/` (ชิ้นส่วน UI สำหรับรายการซื้อของ)
- **`ShoppingItem.jsx`**: การ์ดรายการของที่จะซื้อพร้อมปุ่มติ๊กถูกและปุ่มเติมเข้าคลัง

---

### 3. `src/services/` (Data Access Layer - ติดต่อ Supabase API / Database)
- **`supabaseClient.js`**: ตัวสร้าง Supabase Client Singleton จาก URL และ Anon Key
- **`authService.js`**: จัดการเรื่องการ Sign In, Sign Up และ Sign Out
- **`homeService.js`**: ดึงข้อมูลบ้าน และระบบสร้าง/เข้าร่วมบ้าน (`joinHome`)
- **`stockService.js`**: ดึง เพิ่ม แก้ไข และลบข้อมูลสินค้าสต็อกบนฐานข้อมูล
- **`shoppingService.js`**: ดึงและจัดการรายการซื้อของ
- **`historyService.js`**: ดึงบันทึกประวัติกิจกรรมสต็อกย้อนหลัง
- **`memberService.js`**: ดึงรายชื่อสมาชิกร่วมบ้าน

---

### 4. `src/hooks/` (Business Logic & Custom Hooks)
- **`useAuth.js`**: Hook ดึงข้อมูลผู้ใช้ปัจจุบันและฟังก์ชันสลับ User 1 / User 2
- **`useHome.js`**: Hook ดึงข้อมูลบ้านและรหัสเชิญ
- **`useStock.js`**: Hook จัดการ State ของรายการสินค้าสต็อก
- **`useShoppingList.js`**: Hook จัดการ State รายการของที่ต้องซื้อ
- **`useRealtime.js`**: Hook ดักฟัง Realtime Events สดข้ามหน้าจอและข้าม Browser Tabs

---

### 5. `src/context/` (Global State Provider)
- **`AuthContext.jsx`**: กระจาย State ข้อมูลผู้ใช้ไปทั่วทั้งแอพพลิเคชัน
- **`HomeContext.jsx`**: กระจาย State ข้อมูลบ้านไปทั่วทั้งแอพพลิเคชัน

---

### 6. `src/utils/` (Helper Functions & Constants)
- **`constants.js`**: ค่าคงที่ของระบบ (หมวดหมู่สินค้า, หน่วยนับ, ข้อมูลตัวอย่าง)
- **`stockStatus.js`**: ฟังก์ชันคำนวณและประเมินสถานะสินค้า (🟢 ปกติ, ⚠️ ใกล้หมด, 🔴 หมดแล้ว)
- **`formatDate.js`**: ฟังก์ชันแปลงรูปแบบวันที่และเวลาภาษาไทย
- **`formatQuantity.js`**: ฟังก์ชันต่อเติมจำนวนและหน่วยนับ

---

### 7. `supabase/` (Database Blueprint)
- **`migrations/001_initial_schema.sql`**: คำสั่ง SQL DDL สำหรับสร้างตารางบน Supabase PostgreSQL
- **`seed.sql`**: ข้อมูลเริ่มต้นสำหรับทดสอบระบบ
