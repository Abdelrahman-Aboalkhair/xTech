import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri:
      process.env.NODE_ENV === "production"
        ? "https://egwinch.com/api/v1/graphql"
        : "http://localhost:5000/api/v1/graphql",
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});

export default client;
