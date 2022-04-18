import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";
import { initApollo } from "./context/apollo";
import { ApolloProvider } from "@apollo/client";

function Client(){
    const client = initApollo(false);
    return (
        <ApolloProvider client={client}>
            <RemixBrowser />
        </ApolloProvider>
    )
}

hydrate(<Client />, document);
