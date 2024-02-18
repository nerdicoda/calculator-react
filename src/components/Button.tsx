import { ReactNode } from 'react';
import './Button.css';

export interface ButtonProps {
  children?: ReactNode;
  onClick?: JSX.IntrinsicElements['button']['onClick'];
  value?: string;
  type?: 'numeric' | 'function' | 'equal';
}

export default function Button({
  children,
  onClick,
  value,
  type = 'numeric',
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      value={value}
      className={`key-button key-button-${type}`}
    >
      {children}
    </button>
  );
}
