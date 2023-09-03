const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLSchema,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const bcrypt = require('bcrypt');

const Event = require('../models/event.model');
const User = require('../models/user.model');

const userFn = async (userId) => {
  try {
    const user = await User.findById(userId);

    return {
      ...user._doc,
      id: user.id,
      password: null,
      createdEvents: eventsFn.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

const eventsFn = async (eventIds) => {
  try {
    let events = await Event.find({ _id: { $in: eventIds } });

    events = events.map((event) => {
      return {
        ...event._doc,
        id: event.id,
        date: event.date.toISOString(),
        creator: userFn.bind(this, event._doc.creator),
      };
    });

    return events;
  } catch (err) {
    throw err;
  }
};

const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLFloat },
    date: { type: GraphQLString },
    creator: {
      type: UserType,
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    createdEvents: {
      type: new GraphQLList(EventType),
    },
  }),
});

// const EventInputType = new GraphQLInputObjectType({
//   name: 'EventInput',
//   fields: () => ({
//     title: { type: new GraphQLNonNull(GraphQLString) },
//     description: { type: new GraphQLNonNull(GraphQLString) },
//     price: { type: new GraphQLNonNull(GraphQLFloat) },
//     date: { type: new GraphQLNonNull(GraphQLString) },
//   }),
// });

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    events: {
      type: new GraphQLList(EventType),
      resolve: async (parent, args) => {
        try {
          let events = await Event.find();

          events = events.map((event) => ({
            ...event._doc,
            id: event.id,
            date: event.date.toISOString(),
            creator: userFn.bind(this, event.creator),
          }));

          return events;
        } catch (err) {
          throw err;
        }
      },
    },
  }),
});

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

          let createdUser = await newUser.save();

          createdUser = {
            ...createdUser._doc,
            id: createdUser.id,
            password: null,
          };

          return createdUser;
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
        userId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => {
        try {
          const newEvent = new Event({
            title: args.title,
            description: args.description,
            price: args.price,
            date: new Date(args.date),
            creator: args.userId,
          });

          const user = await User.findById(args.userId);

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
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
