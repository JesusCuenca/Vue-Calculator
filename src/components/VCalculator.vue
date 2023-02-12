<script setup lang="ts">
import VAdditionIcon from "@/components/icons/VAdditionIcon.vue";
import VBackspaceIcon from "@/components/icons/VBackspaceIcon.vue";
import VDivisionIcon from "@/components/icons/VDivisionIcon.vue";
import VMultiplicationIcon from "@/components/icons/VMultiplicationIcon.vue";
import VSubtractionIcon from "@/components/icons/VSubtractionIcon.vue";
import VEqualIcon from "@/components/icons/VEqualIcon.vue";
import { computed, reactive } from "vue";
import type { ICalculatorState } from "@/calculator/types";
import { CalculatorOperators } from "@/calculator/types";
import performMath from "@/calculator";

const state: ICalculatorState = reactive({
  // The current value witten by the user, as a string
  input: "",

  // The total value of the operation, as a string
  total: "",

  // The operator given by the user
  operator: null,

  // Error message, if any
  errorMessage: "",
});

// The value displayed on the calculator:
// automatically concatenates the total value, the given operator and the current input.
const displayValue = computed<string>(() =>
  `${state.total}${state.operator || ""}${state.input}`.trim()
);

const inputIsEmpty = computed<boolean>(
  () => state.input === "" || state.input === "0"
);

/**
 * Clear the screen if a number button is clicked right after an operation has been performed.
 */
let clearNextScreen = false;
function clearScreenAfterResultIfNeeded() {
  if (clearNextScreen) {
    handleClearClick();
    clearNextScreen = false;
  }
}

/**
 * Add a number to the current user input.
 */
function handleNumberClick(value: number) {
  clearScreenAfterResultIfNeeded();

  if (inputIsEmpty.value) {
    // If there is no input, or it is zero, just assign the given number.
    state.input = value.toString();
  } else {
    state.input += value.toString();
  }
}

/**
 * Add a decimal point to the user input.
 * If a decimal point is already present on the input, do nothing.
 */
function handleDecimalPointClick() {
  clearScreenAfterResultIfNeeded();

  if (inputIsEmpty.value) {
    state.input = "0.";
  } else if (!state.input.includes(".")) {
    state.input = state.input + ".";
  }
}

/**
 * Select the operator for the current operation.
 */
function handleOperatorClick(operator: CalculatorOperators) {
  // Our calculator only allows one operation at a time. To make it easier for the user to perform several operations
  // in a row, we will automatically "click the equal symbol" for them.
  handleEqualClick();

  // The user wants to reuse the result of the last operation, so we will avoid to clear the screen the next time a
  // number button is clicked.
  clearNextScreen = false;

  state.operator = operator;
  if (state.input) {
    state.total = state.input;
    state.input = "";
  }
}

/**
 * Clear the screen.
 */
function handleClearClick() {
  state.operator = null;
  state.total = "";
  state.input = "";
}

/**
 * Remove the last written number or operator.
 */
function handleBackspaceClick() {
  if (state.input.length > 0) {
    state.input = state.input.substring(0, state.input.length - 1);
  } else if (state.operator !== null) {
    state.operator = null;
    state.input = state.total;
    state.total = "";
  }
}

/**
 * Perform the current operation.
 */
function handleEqualClick() {
  state.errorMessage = "";
  if (
    state.input.length === 0 ||
    state.operator === null ||
    state.total.length === 0
  ) {
    return;
  }

  const result = performMath(state.total, state.input, state.operator);
  if (result.error) {
    state.errorMessage = result.errorMessage;
  } else {
    state.total = result.result.toString();
    state.input = "";
    state.operator = null;

    // If the user clicks a number button right before an operation has been performed, clear the screen first.
    clearNextScreen = true;
  }
}
</script>

<template>
  <div class="v-calculator">
    <div class="v-calculator__display">
      <div class="v-calculator__display__input" v-html="displayValue"></div>
      <div
        class="v-calculator__display__error"
        v-text="state.errorMessage"
      ></div>
    </div>
    <div class="v-calculator__body">
      <button
        @click="handleOperatorClick(CalculatorOperators.DIVISION)"
        class="v-calculator__btn v-calculator__btn--operator"
      >
        <VDivisionIcon></VDivisionIcon>
      </button>
      <button @click="handleNumberClick(7)" class="v-calculator__btn">7</button>
      <button @click="handleNumberClick(8)" class="v-calculator__btn">8</button>
      <button @click="handleNumberClick(9)" class="v-calculator__btn">9</button>
      <button
        @click="handleClearClick"
        class="v-calculator__btn v-calculator__btn--clear"
      >
        AC
      </button>

      <button
        @click="handleOperatorClick(CalculatorOperators.MULTIPLICATION)"
        class="v-calculator__btn v-calculator__btn--operator"
      >
        <VMultiplicationIcon></VMultiplicationIcon>
      </button>
      <button @click="handleNumberClick(4)" class="v-calculator__btn">4</button>
      <button @click="handleNumberClick(5)" class="v-calculator__btn">5</button>
      <button @click="handleNumberClick(6)" class="v-calculator__btn">6</button>
      <button
        @click="handleBackspaceClick"
        class="v-calculator__btn v-calculator__btn--clear"
      >
        <VBackspaceIcon></VBackspaceIcon>
      </button>

      <button
        @click="handleOperatorClick(CalculatorOperators.SUBTRACTION)"
        class="v-calculator__btn v-calculator__btn--operator"
      >
        <VSubtractionIcon></VSubtractionIcon>
      </button>
      <button @click="handleNumberClick(1)" class="v-calculator__btn">1</button>
      <button @click="handleNumberClick(2)" class="v-calculator__btn">2</button>
      <button @click="handleNumberClick(3)" class="v-calculator__btn">3</button>
      <button
        @click="handleEqualClick"
        class="v-calculator__btn v-calculator__btn--equal"
      >
        <VEqualIcon></VEqualIcon>
      </button>

      <button
        @click="handleOperatorClick(CalculatorOperators.ADDITION)"
        class="v-calculator__btn v-calculator__btn--operator"
      >
        <VAdditionIcon></VAdditionIcon>
      </button>
      <button
        @click="handleNumberClick(0)"
        class="v-calculator__btn v-calculator__btn--zero"
      >
        0
      </button>
      <button @click="handleDecimalPointClick" class="v-calculator__btn">
        .
      </button>
    </div>
  </div>
</template>
