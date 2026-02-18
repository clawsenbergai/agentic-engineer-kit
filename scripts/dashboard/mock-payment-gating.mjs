const budget = 5;
const calls = [1.2, 1.1, 1.8, 1.5];
let spent = 0;

for (const callCost of calls) {
  if (spent + callCost > budget) {
    console.log({ event: "budget_exhausted", spent, callCost, budget });
    break;
  }
  spent += callCost;
  console.log({ event: "tool_call", callCost, spent });
}
