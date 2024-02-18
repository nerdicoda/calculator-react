import { useEffect, useRef, useState } from 'react';
import Button, { ButtonProps } from '../components/Button';
import Display from '../components/Display';
import { CalculatorInput, CalculatorResult, Key } from '../types';
import { calculate } from '../services';
import './Calculator.css';

const MAX_DIGITS = 11;

const keys: Key[] = [
  Key.CE,
  Key.C,
  Key.BACKSPACE,
  Key.DIVIDE,
  Key.SEVEN,
  Key.EIGHT,
  Key.NINE,
  Key.MULTIPLY,
  Key.FOUR,
  Key.FIVE,
  Key.SIX,
  Key.MINUS,
  Key.ONE,
  Key.TWO,
  Key.THREE,
  Key.PLUS,
  Key.PLUS_MINUS,
  Key.ZERO,
  Key.DOT,
  Key.EQUAL,
];

function getKeyType(key: Key): ButtonProps['type'] {
  if (
    (key >= Key.ZERO && key <= Key.NINE) ||
    key === Key.PLUS_MINUS ||
    key === Key.DOT
  ) {
    return 'numeric';
  }
  if (key === Key.EQUAL) {
    return 'equal';
  }
  return 'function';
}

function KeyPad({ onKeyPress }: { onKeyPress?: (key: string) => void }) {
  const handleClick: ButtonProps['onClick'] = (e) => {
    onKeyPress?.(e.currentTarget.value);
  };
  return (
    <div className='calculator-keypad'>
      {keys.map((key) => (
        <Button
          key={key}
          value={key}
          onClick={handleClick}
          type={getKeyType(key)}
        >
          {key}
        </Button>
      ))}
    </div>
  );
}

enum CalculatorState {
  OPERAND1,
  OPERAND2_ZERO,
  OPERAND2,
  RESULT,
}

const operatorRegex = new RegExp(
  `^[${Key.MINUS}${Key.PLUS}${Key.MULTIPLY}${Key.DIVIDE}]{1}$`
);

function getUpdatedOperand(
  currentInput: string,
  key: string,
  charLimit: number = MAX_DIGITS
) {
  let updatedOperand = currentInput;
  if (key >= Key.ZERO && key <= Key.NINE) {
    updatedOperand =
      currentInput === Key.ZERO || currentInput === `${Key.NEGATIVE}${Key.ZERO}`
        ? currentInput.slice(0, -1).concat(key)
        : currentInput.concat(key);
  } else if (key === Key.DOT) {
    if (!currentInput.includes(Key.DOT)) {
      updatedOperand = currentInput.concat(Key.DOT);
    }
  } else if (key === Key.PLUS_MINUS) {
    updatedOperand = currentInput.startsWith(Key.NEGATIVE)
      ? currentInput.slice(1)
      : Key.NEGATIVE.concat(currentInput);
  } else if (key === Key.BACKSPACE) {
    const lastCharRemoved = currentInput.slice(0, -1);
    updatedOperand =
      lastCharRemoved === Key.NEGATIVE || lastCharRemoved === ''
        ? lastCharRemoved.concat(Key.ZERO)
        : lastCharRemoved;
  } else if (key === Key.CE) {
    updatedOperand = Key.ZERO;
  }
  return updatedOperand.slice(0, charLimit);
}

function toCalculatorInput(expression: string): CalculatorInput {
  const elements = expression.split(' ');
  return {
    operand1: Number(elements[0]),
    operator: elements[1] as CalculatorInput['operator'],
    operand2: Number(elements[2]),
  };
}

const keyMapping: { [k in string]: Key } = {
  Delete: Key.CE,
  Escape: Key.C,
  Backspace: Key.BACKSPACE,
  Enter: Key.EQUAL,
};

interface CalculatorProps {
  onCalculateResult?: (calculatorResult: CalculatorResult) => void;
}

export default function Calculator({ onCalculateResult }: CalculatorProps) {
  const [expression, setExpression] = useState<string>('');
  const [currentInput, setCurrentInput] = useState<string>(Key.ZERO);

  const calculatorState = useRef<CalculatorState>(CalculatorState.OPERAND1);

  useEffect(() => {
    // setup function
    function handleKeyboardEvent(e: KeyboardEvent) {
      console.log(e);
      handleKeyPress(keyMapping[e.key] ?? e.key);
    }
    document.addEventListener('keydown', handleKeyboardEvent);
    return () => {
      // clean up function
      document.removeEventListener('keydown', handleKeyboardEvent);
    };
  }, [handleKeyPress]);

  function handleKeyPress(key: string) {
    console.log(`${key} is pressed.`);
    function reset() {
      setExpression('');
      setCurrentInput(Key.ZERO);
      calculatorState.current = CalculatorState.OPERAND1;
    }
    function setResult() {
      const fullExpression = expression.concat(` ${currentInput} ${Key.EQUAL}`);
      setExpression(fullExpression);
      const calculatorResult = calculate(
        toCalculatorInput(fullExpression),
        MAX_DIGITS
      );
      setCurrentInput(calculatorResult.result?.toString() ?? 'Error');
      onCalculateResult?.(calculatorResult);
      calculatorState.current = CalculatorState.RESULT;
    }
    switch (calculatorState.current) {
      case CalculatorState.OPERAND1: {
        if (key === Key.C) {
          reset();
        } else if (key.match(operatorRegex)) {
          setExpression(currentInput.concat(` ${key}`));
          setCurrentInput(Key.ZERO);
          calculatorState.current = CalculatorState.OPERAND2_ZERO;
        } else {
          setCurrentInput(getUpdatedOperand(currentInput, key));
        }
        break;
      }
      case CalculatorState.OPERAND2_ZERO: {
        if (key === Key.C) {
          reset();
        } else if (key === Key.EQUAL) {
          setResult();
        } else if (key.match(operatorRegex)) {
          setExpression(expression.slice(0, -1).concat(key));
        } else {
          const updatedOperand = getUpdatedOperand(currentInput, key);
          setCurrentInput(updatedOperand);
          if (updatedOperand !== Key.ZERO) {
            calculatorState.current = CalculatorState.OPERAND2;
          }
        }
        break;
      }
      case CalculatorState.OPERAND2: {
        if (key === Key.C) {
          reset();
        } else if (key === Key.EQUAL) {
          setResult();
        } else {
          const updatedOperand = getUpdatedOperand(currentInput, key);
          setCurrentInput(updatedOperand);
          if (updatedOperand === Key.ZERO) {
            calculatorState.current = CalculatorState.OPERAND2_ZERO;
          }
        }
        break;
      }
      case CalculatorState.RESULT: {
        if (key === Key.C) {
          reset();
        }
        break;
      }
    }
  }
  return (
    <div className='calculator-main'>
      <Display main={currentInput} secondary={expression}></Display>
      <KeyPad onKeyPress={handleKeyPress}></KeyPad>
    </div>
  );
}
