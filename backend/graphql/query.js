const { GraphQLObjectType, GraphQLList } = require('graphql');

const { BookingType, EventType } = require('./type');
const Event = require('../models/event.model');
// const User = require('../models/user.model');
const Booking = require('../models/booking.model');
const { userFn, singleEventFn } = require('./utils');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    events: {
      type: new GraphQLList(EventType),
      resolve: async (parent, args) => {
        try {
          const events = await Event.find();

          return events.map((event) => ({
            ...event._doc,
            id: event.id,
            date: event.date.toISOString(),
            creator: userFn.bind(this, event.creator),
          }));
        } catch (err) {
          throw err;
        }
      },
    },
    bookings: {
      type: new GraphQLList(BookingType),
      resolve: async (parent, args) => {
        try {
          const bookings = await Booking.find();
          return bookings.map((booking) => {
            return {
              ...booking._doc,
              id: booking.id,
              user: userFn.bind(this, booking.user),
              event: singleEventFn.bind(this, booking.event),
              createdAt: booking.createdAt.toISOString(),
              updatedAt: booking.updatedAt.toISOString(),
            };
          });
        } catch (err) {
          throw err;
        }
      },
    },
  }),
});

module.exports = RootQuery;
