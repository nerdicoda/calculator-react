import { CalculatorInput, CalculatorResult } from '../types';

export function calculate(
  input: CalculatorInput,
  precision: number = 10
): CalculatorResult {
  const { operator, operand1, operand2 } = input;
  let result: number | undefined = undefined;
  let message: string | undefined = undefined;

  switch (operator) {
    case '+':
      result = operand1 + operand2;
      break;
    case '-':
      result = operand1 - operand2;
      break;
    case '*':
      result = operand1 * operand2;
      break;
    case '/':
      if (operand2 === 0) {
        message = 'Division by zero';
      } else {
        result = operand1 / operand2;
      }
      break;
    default:
      message = `Operator ${operator} is not supported`;
  }
  return {
    ...input,
    id: Math.floor(Math.random() * 1000000).toString(),
    result:
      result !== undefined
        ? parseFloat(result.toPrecision(precision))
        : undefined,
    message,
    timestamp: Date.now(),
  };
}
