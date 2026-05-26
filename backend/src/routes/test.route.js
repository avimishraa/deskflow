const express = require("express");
const Ticket = require("../models/ticket.model");

const router = express.Router();

router.get("/", async (req, res) => {
  const tickets = await Ticket.find();

  res.json(tickets);
});

module.exports = router;