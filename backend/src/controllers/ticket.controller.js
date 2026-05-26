const Ticket = require("../models/ticket.model");
const { calculateTicketMetrics } = require("../utils/sla");

const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);

    const metrics = calculateTicketMetrics(ticket);

    res.status(201).json({
      success: true,
      data: {
        ...ticket.toObject(),
        ...metrics
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


const getTickets = async (req, res) => {
  try {
    const { status, priority, breached } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    let tickets = await Ticket.find(query).sort({
      createdAt: -1
    });

    tickets = tickets.map((ticket) => {
      const metrics = calculateTicketMetrics(ticket);

      return {
        ...ticket.toObject(),
        ...metrics
      };
    });

    if (breached === "true") {
      tickets = tickets.filter(
        (ticket) => ticket.slaBreached === true
      );
    }

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const { isValidTransition } = require("../utils/transitions");

const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const currentStatus = ticket.status;

    if (currentStatus === status) {
      return res.status(400).json({
        success: false,
        message: "Ticket already in this status"
      });
    }

    const valid = isValidTransition(currentStatus, status);

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: `Invalid transition from ${currentStatus} to ${status}`
      });
    }

    ticket.status = status;

    if (status === "resolved") {
      ticket.resolvedAt = new Date();
    }

    if (
      currentStatus === "resolved" &&
      status === "in_progress"
    ) {
      ticket.resolvedAt = null;
    }

    await ticket.save();

    const metrics = calculateTicketMetrics(ticket);

    res.status(200).json({
      success: true,
      data: {
        ...ticket.toObject(),
        ...metrics
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Ticket deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getTicketStats = async (req, res) => {
  try {
    const tickets = await Ticket.find();

    const statusCounts = {
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0
    };

    const priorityCounts = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0
    };

    let breachedOpenTickets = 0;

    tickets.forEach((ticket) => {
      statusCounts[ticket.status]++;

      priorityCounts[ticket.priority]++;

      const metrics = calculateTicketMetrics(ticket);

      if (
        metrics.slaBreached &&
        ticket.status !== "resolved" &&
        ticket.status !== "closed"
      ) {
        breachedOpenTickets++;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalTickets: tickets.length,
        statusCounts,
        priorityCounts,
        breachedOpenTickets
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createTicket,
  getTickets,
  updateTicketStatus,
  deleteTicket,
  getTicketStats
};