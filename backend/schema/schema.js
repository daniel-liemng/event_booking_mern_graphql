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
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
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
      resolve() {
        const events = Event.find().then((ev) => {
          return ev.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            date: item.date.toISOString(),
          }));
        });
        return events;
        // return Event.find();
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
      resolve(parent, args) {
        return (
          User.findOne({ email: args.email })
            .then((user) => {
              if (user) {
                throw new Error('User exists already');
              }

              return bcrypt.hash(args.password, 12);
            })
            .then((hashedPassword) => {
              const newUser = new User({
                email: args.email,
                password: hashedPassword,
              });
              return newUser.save();
            })
            // not return password to frontend
            .then((result) => {
              return { id: result.id, email: result.email };
            })
            .catch((err) => {
              throw err;
            })
        );
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
      resolve(parent, args) {
        const newEvent = new Event({
          title: args.title,
          description: args.description,
          price: args.price,
          date: new Date(args.date),
          creator: args.userId,
        });

        let createdEvent;

        return newEvent
          .save()
          .then((eventResult) => {
            createdEvent = eventResult;
            return User.findById(args.userId);
          })
          .then((user) => {
            if (!user) {
              throw new Error('User not found');
            }
            user.createdEvents.push(newEvent);
            return user.save();
          })
          .then((result) => {
            return createdEvent;
          })
          .catch((err) => {
            throw err;
          });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
