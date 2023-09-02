const { GraphQLObjectType, GraphQLID, GraphQLSchema } = require('graphql');

const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    id: { type: GraphQLID },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({}),
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {},
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
