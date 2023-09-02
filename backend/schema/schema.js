const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLSchema,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const Event = require('../models/event.model');

const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLFloat },
    date: { type: GraphQLString },
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
    createEvent: {
      type: EventType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        date: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const newEvent = new Event({
          title: args.title,
          description: args.description,
          price: args.price,
          date: new Date(args.date),
        });

        return newEvent.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
