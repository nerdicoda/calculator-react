import './Display.css';

interface DisplayProps {
  secondary?: string;
  main?: string;
}

export default function Display({ main, secondary }: DisplayProps) {
  return (
    <div className='display'>
      <div className='display-secondary'>{secondary}</div>
      <div className='display-main'>{main}</div>
    </div>
  );
}
