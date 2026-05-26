const allowedTransitions = {
  open: ["in_progress"],

  in_progress: ["open", "resolved"],

  resolved: ["in_progress", "closed"],

  closed: ["resolved"]
};

const isValidTransition = (currentStatus, newStatus) => {
  return allowedTransitions[currentStatus]?.includes(newStatus);
};

module.exports = {
  allowedTransitions,
  isValidTransition
};