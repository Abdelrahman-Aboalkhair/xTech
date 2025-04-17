import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:5000/api/v1/graphql",
    credentials: "include",
  }),
  cache: new InMemoryCache({ addTypename: false }),
});

export default client;
