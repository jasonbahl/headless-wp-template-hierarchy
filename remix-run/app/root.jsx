import { useContext } from 'react';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ApolloContext } from "./context/apollo";

export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

import styles from "./styles/app.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export default function App() {

  // send the Apollo state to the client
  const initialState = useContext(ApolloContext);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <script 
          dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__=${JSON.stringify(initialState).replace(/</g, "\\u003c")}`
          }}
        />
      </body>
    </html>
  );
}
