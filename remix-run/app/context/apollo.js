import { createContext } from 'react';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import possibleTypes from '../../possibleTypes.json';

const isBrowser = typeof window !== 'undefined';
const initialState = isBrowser ? window.__APOLLO_STATE__ : {};

export const initApollo = (ssrMode = true) => {
    return new ApolloClient({
        cache: new InMemoryCache({
            possibleTypes,
            typePolicies: {
                RootQuery: {
                    queryType: true,
                },
                RootMutation: {
                    mutationType: true,
                },
            }
        }).restore(initialState),
        link: new HttpLink({
            uri: 'https://content.wpgraphql.com/graphql'
        }),
        ssrMode
    });
};

export const ApolloContext = createContext(initialState);
export const ApolloProvider = ApolloContext.Provider;