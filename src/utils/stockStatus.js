export function getStockStatus(quantity, minThreshold) {
  if (quantity === 0) {
    return {
      status: 'OUT_OF_STOCK',
      label: '🔴 หมดแล้ว',
      badgeClass: 'badge-out',
      statusBarClass: 'status-bar-out',
      isOut: true,
      isLow: false
    };
  }

  if (quantity <= minThreshold) {
    return {
      status: 'LOW_STOCK',
      label: '⚠️ ใกล้หมด',
      badgeClass: 'badge-low',
      statusBarClass: 'status-bar-low',
      isOut: false,
      isLow: true
    };
  }

  return {
    status: 'IN_STOCK',
    label: 'ปกติ',
    badgeClass: 'badge-normal',
    statusBarClass: 'status-bar-ok',
    isOut: false,
    isLow: false
  };
}
