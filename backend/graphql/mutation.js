const {
  GraphQLFloat,
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const { UserType, EventType, BookingType } = require('./type');
const Event = require('../models/event.model');
const User = require('../models/user.model');
const Booking = require('../models/booking.model');
const { userFn, singleEventFn } = require('./utils');

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        try {
          const user = await User.findOne({ email: args.email });

          if (user) {
            throw new Error('User already exists');
          }

          const hashedPassword = await bcrypt.hash(args.password, 12);

          const newUser = new User({
            email: args.email,
            password: hashedPassword,
          });

          const createdUser = await newUser.save();

          return {
            ...createdUser._doc,
            id: createdUser.id,
            password: null,
          };
        } catch (err) {
          throw err;
        }
      },
    },
    createEvent: {
      type: EventType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        date: { type: new GraphQLNonNull(GraphQLString) },
        // userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args, req) => {
        if (!req.isAuth) {
          throw new Error('Unauthenticated !!');
        }

        try {
          const newEvent = new Event({
            title: args.title,
            description: args.description,
            price: args.price,
            date: new Date(args.date),
            creator: req.userId,
          });

          const user = await User.findById(req.userId);

          if (!user) {
            throw new Error('User not found');
          }

          user.createdEvents.push(newEvent);

          await user.save();

          const createdEvent = await newEvent.save();

          return {
            ...createdEvent._doc,
            id: createdEvent.id,
            date: createdEvent.date.toISOString(),
            creator: userFn.bind(this, createdEvent.creator),
          };
        } catch (err) {
          throw err;
        }
      },
    },
    createBooking: {
      type: BookingType,
      args: {
        eventId: { type: new GraphQLNonNull(GraphQLID) },
        // userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args, req) => {
        if (!req.isAuth) {
          throw new Error('Unauthenticated !!');
        }
        const event = await Event.findById(args.eventId);
        const user = await User.findById(req.userId);
        const booking = new Booking({
          user,
          event,
        });

        const createdBooking = await booking.save();
        return {
          ...createdBooking._doc,
          id: createdBooking.id,
          user: userFn.bind(this, createdBooking.user),
          event: singleEventFn.bind(this, createdBooking.event),
          createdAt: createdBooking.createdAt.toISOString(),
          updatedAt: createdBooking.updatedAt.toISOString(),
        };
      },
    },
    cancelBooking: {
      type: EventType,
      args: {
        bookingId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, args, req) => {
        if (!req.isAuth) {
          throw new Error('Unauthenticated !!');
        }
        try {
          const booking = await Booking.findById(args.bookingId).populate(
            'event'
          );
          const event = {
            ...booking.event._doc,
            id: booking.event.id,
            creator: userFn.bind(this, booking.event.creator),
          };

          await Booking.findByIdAndDelete(args.bookingId);

          return event;
        } catch (err) {
          throw err;
        }
      },
    },
  },
});

module.exports = Mutation;
