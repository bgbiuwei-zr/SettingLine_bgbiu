import React from 'react';
import './CircleIcon.less';

interface CircleIconProps {
  color: string;
  isActive: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
  isDeleteButton?: boolean;
}

const CircleIcon: React.FC<CircleIconProps> = ({ 
  color, 
  isActive, 
  onClick, 
  label, 
  disabled = false,
  isDeleteButton = false 
}) => {
  const displayColor = disabled ? '#cccccc' : (isActive ? color : '#999999');

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <button 
      className={`circle-icon ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''} ${isDeleteButton ? 'delete-button' : ''}`}
      onClick={handleClick}
      aria-label={label}
      disabled={disabled}
    >
      <svg width="40" height="40" viewBox="0 0 36 36">
        {isDeleteButton ? (
          // 删除按钮显示红色叉叉
          <>
            <circle
              cx="18"
              cy="16"
              r="12"
              fill="white"
              stroke="#cd3838"
              strokeWidth="3"
            />
            <path
              d="M13 13l10 10M23 13l-10 10"
              stroke="#cd3838" 
              strokeWidth="3"
              strokeLinecap="round"
            />
          </>
        ) : (
          // 其他按钮显示空心圆环
          <circle
            cx="18"
            cy="16"
            r="12"
            fill="none"
            stroke={displayColor}
            strokeWidth="6"
          />
        )}
      </svg>
      <span className="circle-icon__label">{label}</span>
    </button>
  );
};

export default CircleIcon;