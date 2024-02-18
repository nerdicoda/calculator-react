import { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  title?: string;
  children?: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className='card'>
      <h3 className='card-title'>{title}</h3>
      <div className='card-content'>{children}</div>
    </div>
  );
}
