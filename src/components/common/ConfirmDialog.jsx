import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'ยืนยันการทำรายการ', message = 'คุณต้องการดำเนินการนี้หรือไม่?' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4 text-sm text-slate-300">
        <p>{message}</p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>ยกเลิก</Button>
          <Button variant="danger" onClick={onConfirm}>ยืนยัน</Button>
        </div>
      </div>
    </Modal>
  );
}
