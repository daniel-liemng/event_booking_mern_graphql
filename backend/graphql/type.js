const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
} = require('graphql');

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

const AuthDataType = new GraphQLObjectType({
  name: 'AuthData',
  fields: () => ({
    userId: { type: GraphQLID },
    token: { type: GraphQLString },
    tokenExpiration: { type: GraphQLInt },
  }),
});

const BookingType = new GraphQLObjectType({
  name: 'Booking',
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: UserType },
    event: { type: EventType },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

module.exports = { UserType, EventType, BookingType, AuthDataType };

// const EventInputType = new GraphQLInputObjectType({
//   name: 'EventInput',
//   fields: () => ({
//     title: { type: new GraphQLNonNull(GraphQLString) },
//     description: { type: new GraphQLNonNull(GraphQLString) },
//     price: { type: new GraphQLNonNull(GraphQLFloat) },
//     date: { type: new GraphQLNonNull(GraphQLString) },
//   }),
// });
