import type { MathResult } from "@/calculator/types";
import { CalculatorOperators } from "@/calculator/types";

export default function performMath(
  input1: string,
  input2: string,
  operator: CalculatorOperators
): MathResult {
  let result: number = NaN;
  const number1 = parseFloat(input1);
  const number2 = parseFloat(input2);

  if (isNaN(number1) || isNaN(number2)) {
    return {
      error: true,
      errorMessage: "Ups! It seems that the input is invalid...",
    };
  }

  switch (operator) {
    case CalculatorOperators.ADDITION:
      result = number1 + number2;
      break;
    case CalculatorOperators.SUBTRACTION:
      result = number1 - number2;
      break;
    case CalculatorOperators.MULTIPLICATION:
      result = number1 * number2;
      break;
    case CalculatorOperators.DIVISION:
      result = number1 / number2;
      break;
    default:
      return {
        error: true,
        errorMessage: "Ups! We don't recognize that operator...",
      };
  }

  if (isNaN(result) || !isFinite(result)) {
    const errorMessage =
      operator === CalculatorOperators.DIVISION && number2 !== 0
        ? "Ups! You cannot divide between zero..."
        : "Ups! We encountered an error performing the operation... Why don't you try that again?";

    return {
      error: true,
      errorMessage,
    };
  }

  return { result };
}
