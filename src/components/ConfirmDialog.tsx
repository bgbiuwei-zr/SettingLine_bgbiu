import React from 'react';
import './ConfirmDialog.less';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog__header">
          <h3>{title}</h3>
        </div>
        <div className="confirm-dialog__body">
          <p>{message}</p>
        </div>
        <div className="confirm-dialog__footer">
          <button 
            className="confirm-dialog__button confirm-dialog__button--cancel" 
            onClick={onCancel}
          >
            取消
          </button>
          <button 
            className="confirm-dialog__button confirm-dialog__button--confirm" 
            onClick={onConfirm}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;