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

export function ensureUUID(idStr) {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (idStr && uuidRegex.test(idStr)) {
    return idStr;
  }
  if (!idStr) {
    return '88290000-0000-0000-0000-000000000000';
  }
  if (typeof idStr === 'string' && idStr.trim()) {
    const cleanStr = idStr.trim().toUpperCase();
    let hash = 0;
    for (let i = 0; i < cleanStr.length; i++) {
      hash = (hash << 5) - hash + cleanStr.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(12, '0');
    return `88290000-0000-4000-8000-${hex.slice(-12)}`;
  }
  return '88290000-0000-0000-0000-000000000000';
}

export function compressImage(file, callback, maxWidth = 500, maxHeight = 500, quality = 0.8) {
  if (!file) return;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target.result;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        callback(dataUrl);
      } else {
        callback(event.target.result);
      }
    };
    img.onerror = () => callback(event.target.result);
  };
}
