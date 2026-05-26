const express = require("express");

const {
  createTicket,
  getTickets,
  updateTicketStatus,
  deleteTicket,
  getTicketStats
} = require("../controllers/ticket.controller");

const router = express.Router();

router.post("/", createTicket);

router.get("/", getTickets);

router.get("/stats", getTicketStats);

router.patch("/:id", updateTicketStatus);

router.delete("/:id", deleteTicket);

module.exports = router;