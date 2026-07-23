import React from 'react';
import { getStockStatus } from '../../utils/stockStatus';

export function StockStatusBadge({ quantity, minThreshold }) {
  const { label, badgeClass } = getStockStatus(quantity, minThreshold);
  return (
    <span className={`text-[10px] px-2 py-0.3 rounded-full font-bold ${badgeClass}`}>
      {label}
    </span>
  );
}
