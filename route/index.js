const express = require("express");
const authRouter = require("../route/authRoute");
const eventRouter = require("../route/eventRoute");
const router = express.Router();

router.use("/auth", authRouter);
router.use("/event", eventRouter);

module.exports = router;
