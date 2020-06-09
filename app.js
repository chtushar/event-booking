require("dotenv").config();
require("./db/mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 4000;

const Event = require("./models/event");

app.use(bodyParser.json());
app.use(cors());

const eventsList = [
  {
    _id: "1",
    title: "Event1",
    description: "Event1Event1Event1",
    price: 52.5,
    date: "Thu 15 May",
  },
  {
    _id: "2",
    title: "Event2",
    description: "Event2Event2Event2",
    price: 52.5,
    date: "Thu 15 May",
  },
];

app.use(
  "/api",
  graphqlHTTP({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery{
          events: [Event!]!
      }

      type RootMutation{
          createEvent(eventInput: EventInput): Event
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: () => {
        return eventsList;
      },

      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          date: new Date("2020-06-09T12:38:42.030Z"),
          price: parseFloat(args.eventInput.price),
        });

        console.log(args.eventInput.date);
        return event
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc };
          })
          .catch((err) => {
            console.log(err);
            throw Error;
          });
      },
    },
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(`Open in browser: http://localhost:${PORT}`);
});
