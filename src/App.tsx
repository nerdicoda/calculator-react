import { useState } from 'react';
import Calculator from './layouts/Calculator';
import History from './layouts/History';
import Menu from './layouts/Menu';
import { CalculatorResult, MenuItem } from './types';
import './App.css';

const menuItems = [MenuItem.CALCULATOR, MenuItem.HISTORY];

export default function App() {
  const [selectedItem, setSelectedItem] = useState<MenuItem>(
    MenuItem.CALCULATOR
  );
  const [calculations, setCalculations] = useState<CalculatorResult[]>([]);

  function handleMenuSelection(menuItem: MenuItem) {
    setSelectedItem(menuItem);
  }
  function handleCalculateResult(calculatorResult: CalculatorResult) {
    setCalculations((previousCalculations) =>
      [calculatorResult].concat(previousCalculations)
    );
  }
  return (
    <div className='calculator-app'>
      <div className='calculator-app-menu'>
        <Menu
          menuItems={menuItems}
          onClick={handleMenuSelection}
          selectedItem={selectedItem}
        ></Menu>
      </div>
      {selectedItem === MenuItem.CALCULATOR ? (
        <Calculator onCalculateResult={handleCalculateResult}></Calculator>
      ) : (
        <History calculations={calculations}></History>
      )}
    </div>
  );
}
