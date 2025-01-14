const Event = require("../models/Event");

const createEvent = async (req, res) => {
  try {
    const { name, description, date, time, location, category, image } =
      req.body;
    const event = await Event.create({
      name,
      description,
      date,
      time,
      location,
      category,
      image,
      createdBy: req.user._id,
    });

    req.io.emit("eventCreated", event);

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "username email")
      .populate("attendees", "username email");
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllEventsById = async (req, res) => {
  try {
    const { eventId } = req.query;
    const queryCondition = eventId
      ? { _id: eventId }
      : { createdBy: req.user._id };

    const events = await Event.find(queryCondition)
      .populate("createdBy", "username email")
      .populate("attendees", "username email");

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const addAttendee = async (req, res) => {
  try {
    const { eventId } = req.query;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const userId = req.user._id;
    if (event.attendees.includes(userId)) {
      return res.status(200).json({
        success: false,
        message: "Already a participant",
      });
    }

    event.attendees.push(userId);
    await event.save();
    req.io.emit("attendeeUpdated", {
      eventId: eventId,
      attendees: event.attendees.length,
    });

    return res.status(200).json({
      success: true,
      message: "RSVP successful",
      data: {
        eventId: event._id,
        attendeesCount: event.attendees.length,
      },
    });
  } catch (error) {
    console.error("Error in RSVP:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your RSVP",
      error: error.message,
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.query;

    if (!eventId) {
      return res
        .status(400)
        .json({ success: false, message: "Event ID is required" });
    }

    const updates = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, {
      new: true,
    });

    if (!updatedEvent) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    req.io.emit("eventUpdated", updatedEvent);

    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.query;

    if (!eventId) {
      return res
        .status(400)
        .json({ success: false, message: "Event ID is required" });
    }

    const event = await Event.findByIdAndDelete(eventId);
    
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    req.io.emit("eventDeleted", { eventId });

    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getAllEventsById,
  addAttendee,
  updateEvent,
  deleteEvent,
};
