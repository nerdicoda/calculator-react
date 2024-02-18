import Card from '../components/Card';
import { CalculatorResult } from '../types';
import './History.css';

interface HistoryProps {
  calculations: CalculatorResult[];
}

function toExpression(calculatorResult: CalculatorResult): string {
  const { operand1, operand2, operator, result, message } = calculatorResult;
  return `${operand1} ${operator} ${operand2} = ${
    result ?? message ?? 'Error'
  }`;
}

export default function History({ calculations }: HistoryProps) {
  return (
    <div className='calculator-history'>
      {calculations.map((calculatorResult) => (
        <Card
          key={calculatorResult.id}
          title={new Date(calculatorResult.timestamp).toString()}
        >
          {toExpression(calculatorResult)}
        </Card>
      ))}
    </div>
  );
}
