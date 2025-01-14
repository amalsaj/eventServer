const {
  addAttendee,
  deleteEvent,
  updateEvent,
  getAllEventsById,
  getAllEvents,
  createEvent,
} = require("../controller/eventController");
const authMiddleware = require("../utils/authMiddleware");
const router = require("express").Router();
router.route("/createEvent").post(authMiddleware, createEvent);
router.route("/getAllEvents").get(getAllEvents);
router.route("/getEventById").get(authMiddleware, getAllEventsById);
router.route("/updateEvent").put(authMiddleware, updateEvent);
router.route("/deleteEvent").delete(authMiddleware, deleteEvent);
router.route("/addAttendee").post(authMiddleware, addAttendee);

module.exports = router;
