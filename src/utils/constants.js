export const CATEGORIES = [
  'ALL',
  'ของใช้ส่วนตัว',
  'ของใช้ในบ้าน',
  'อาหารแห้ง',
  'เครื่องดื่ม',
  'ยาสามัญ'
];

export const UNITS = [
  'ชิ้น',
  'ขวด',
  'ห่อ',
  'ก้อน',
  'กระปุก',
  'กล่อง',
  'แพ็ค',
  'ถุง'
];

export const DEFAULT_HOUSE = {
  id: 'h_home_8829',
  code: 'HOME-8829',
  name: 'บ้านของเรา 🏡',
  inviteLink: 'https://meeyoo.app/invite?code=HOME-8829',
  created_at: new Date().toISOString()
};

export const DEFAULT_MEMBERS = [
  { id: 'u1', name: 'User 1 (คุณสมชาย)', email: 'user1@meeyoo.app', role: 'เจ้าของบ้าน', avatar: '👨‍💻' },
  { id: 'u2', name: 'User 2 (คุณสมหญิง)', email: 'user2@meeyoo.app', role: 'สมาชิก', avatar: '👩‍🎨' }
];
