import React from 'react';
import { StockCard } from './StockCard';
import { EmptyState } from '../common/EmptyState';

export function StockList({ items, onQuickUse, onUpdateQty, onEdit, onDelete }) {
  if (!items || items.length === 0) {
    return <EmptyState message="ไม่พบรายการสินค้าในคลัง" />;
  }

  return (
    <div className="space-y-3">
      {items.map(item => (
        <StockCard 
          key={item.id} 
          item={item} 
          onQuickUse={onQuickUse} 
          onUpdateQty={onUpdateQty} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}
