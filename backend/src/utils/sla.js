const SLA_MINUTES = {
  low: 72 * 60,
  medium: 24 * 60,
  high: 4 * 60,
  urgent: 1 * 60
};

const calculateTicketMetrics = (ticket) => {
  const endTime =
    ticket.status === "resolved" && ticket.resolvedAt
      ? new Date(ticket.resolvedAt)
      : new Date();

  const createdTime = new Date(ticket.createdAt);

  const ageMinutes = Math.floor(
    (endTime - createdTime) / (1000 * 60)
  );

  const slaTarget = SLA_MINUTES[ticket.priority];

  const slaBreached = ageMinutes > slaTarget;

  return {
    ageMinutes,
    slaBreached
  };
};

module.exports = {
  calculateTicketMetrics,
  SLA_MINUTES
};