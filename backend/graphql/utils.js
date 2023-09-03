// Functions to extract the nested data in Graphql

const Event = require('../models/event.model');
const User = require('../models/user.model');

const userFn = async (userId) => {
  try {
    const user = await User.findById(userId);

    return {
      ...user._doc,
      id: user.id,
      password: null,
      createdEvents: eventsFn.bind(this, user.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

const eventsFn = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });

    return events.map((event) => {
      return {
        ...event._doc,
        id: event.id,
        date: event.date.toISOString(),
        creator: userFn.bind(this, event.creator),
      };
    });
  } catch (err) {
    throw err;
  }
};

const singleEventFn = async (eventId) => {
  try {
    const event = await Event.findById(eventId);

    return {
      ...event._doc,
      id: event.id,
      date: event.date.toISOString(),
      creator: userFn.bind(this, event.creator),
    };
  } catch (err) {
    throw err;
  }
};

module.exports = { userFn, eventsFn, singleEventFn };
