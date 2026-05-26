const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const testRoute = require("./routes/test.route");
const ticketRoute = require("./routes/ticket.route");

const app = express();

app.use(
  cors({
    origin: "*"
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/test", testRoute);
app.use("/tickets", ticketRoute);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DeskFlow API Running"
  });
});

module.exports = app;