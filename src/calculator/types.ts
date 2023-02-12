export enum CalculatorOperators {
  ADDITION = "&plus;",
  SUBTRACTION = "&minus;",
  DIVISION = "&divide;",
  MULTIPLICATION = "&times;",
}

export interface ICalculatorState {
  input: string;
  total: string;
  operator: CalculatorOperators | null;
  errorMessage: string;
}

export interface IMathResultSuccess {
  result: number;
  error?: false;
}
export interface IMathResultError {
  error: true;
  errorMessage: string;
}
export type MathResult = IMathResultError | IMathResultSuccess;
