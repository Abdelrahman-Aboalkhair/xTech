"use client";
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";

const httpLink = new HttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://egwinch.com/api/v1/graphql"
      : "http://localhost:5000/api/v1/graphql",
  credentials: "include",
});

const wsLink = new WebSocketLink(
  new SubscriptionClient(
    process.env.NODE_ENV === "production"
      ? "wss://egwinch.com/api/v1/graphql"
      : "ws://localhost:5000/api/v1/graphql",
    {
      reconnect: true,
      connectionParams: {
        headers: {
          Cookie: document.cookie,
        },
      },
    }
  )
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({ addTypename: false }),
});

export default client;
