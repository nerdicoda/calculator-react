export interface CalculatorInput {
  operator: '+' | '-' | '*' | '/';
  operand1: number;
  operand2: number;
}

export interface CalculatorResult extends CalculatorInput {
  id: string;
  result?: number;
  message?: string;
  timestamp: number;
}
