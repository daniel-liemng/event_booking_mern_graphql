const express = require('express');
const dotenv = require('dotenv');
require('colors');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');

const schema = require('./schema/schema');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
  })
);

const PORT = process.env.PORT || 5001;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('DB Connected'.bgGreen);
    app.listen(PORT, () => console.log(`Server on port ${PORT}`.bgBlue));
  })
  .catch((err) => console.log('Server Error'.bgRed));
