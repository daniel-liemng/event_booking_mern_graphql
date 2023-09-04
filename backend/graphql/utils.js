// Functions to extract the nested data in Graphql
const DataLoader = require('dataloader');

const Event = require('../models/event.model');
const User = require('../models/user.model');

// DATALOADER
const eventLoader = new DataLoader((eventIds) => {
  return eventsFn(eventIds);
});

const userLoader = new DataLoader((userIds) => {
  console.log(userIds);
  return User.find({ _id: { $in: userIds } });
});

const userFn = async (userId) => {
  try {
    // const user = await User.findById(userId);

    const user = await userLoader.load(userId.toString());

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
        // creator: userLoader.load.bind(this, event.creator),
        creator: userFn.bind(this, event.creator),
      };
    });
  } catch (err) {
    throw err;
  }
};

const singleEventFn = async (eventId) => {
  try {
    // const event = await Event.findById(eventId);
    // return {
    //   ...event._doc,
    //   id: event.id,
    //   date: event.date.toISOString(),
    //   creator: userFn.bind(this, event.creator),
    // };

    // Use DataLoader
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (err) {
    throw err;
  }
};

module.exports = { userFn, eventsFn, singleEventFn, eventLoader, userLoader };
