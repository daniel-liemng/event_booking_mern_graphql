const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { BookingType, EventType, AuthDataType } = require('./type');
const Event = require('../models/event.model');
const User = require('../models/user.model');
const Booking = require('../models/booking.model');
const { userFn, singleEventFn } = require('./utils');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    login: {
      type: AuthDataType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        const user = await User.findOne({ email: args.email });

        if (!user) {
          throw new Error('User does not exist');
        }

        const isPasswordMatched = await bcrypt.compare(
          args.password,
          user.password
        );

        if (!isPasswordMatched) {
          throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return { userId: user.id, token, tokenExpiration: 1 };
      },
    },
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
