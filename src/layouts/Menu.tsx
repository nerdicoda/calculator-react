import { MenuItem } from '../types';
import './Menu.css';

interface MenuProps {
  menuItems: MenuItem[];
  onClick?: (menuItem: MenuItem) => void;
  selectedItem?: MenuItem;
}

export default function Menu({ menuItems, onClick, selectedItem }: MenuProps) {
  return (
    <div className='menu'>
      {menuItems.map((menuItem) => (
        <a
          className='menu-item'
          href='#'
          key={menuItem}
          onClick={() => onClick?.(menuItem)}
        >
          <span
            className={`menu-item-text${
              selectedItem === menuItem ? ' menu-item-text-underline' : ''
            }`}
          >
            {menuItem}
          </span>
        </a>
      ))}
    </div>
  );
}
