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
  id: '88290000-0000-0000-0000-000000000000',
  code: 'HOME-8829',
  name: 'บ้านของเรา 🏡',
  inviteLink: 'https://meeyoo.app/invite?code=HOME-8829',
  created_at: new Date().toISOString()
};

export function ensureUUID(idStr) {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (idStr && uuidRegex.test(idStr)) {
    return idStr;
  }
  if (!idStr || idStr === 'h_home_8829' || idStr === 'HOME-8829' || idStr.startsWith('h_home_8829')) {
    return '88290000-0000-0000-0000-000000000000';
  }
  if (typeof idStr === 'string' && idStr.trim()) {
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
      hash = (hash << 5) - hash + idStr.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(12, '0');
    return `88290000-0000-4000-8000-${hex.slice(-12)}`;
  }
  return '88290000-0000-0000-0000-000000000000';
}

