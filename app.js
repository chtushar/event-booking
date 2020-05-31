const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
      type RootQuery{
          events
      }      
      
      type RootMutation{

      }

      schema{
                query: RootQuery
                mutation: RootMutation
            }
      `),
    rootValue: {},
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(`Open in browser: http://localhost:${PORT}`);
});
