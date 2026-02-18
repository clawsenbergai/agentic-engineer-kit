const valid = {
  from: "planner",
  to: "executor",
  capability: "code_review",
  payload: { taskId: "task-01", constraints: ["safe", "typed"] },
};

const invalid = {
  from: "planner",
  payload: {},
};

function validate(obj) {
  return Boolean(obj.from && obj.to && obj.capability && obj.payload?.taskId);
}

console.log("valid payload", validate(valid));
console.log("invalid payload", validate(invalid));
