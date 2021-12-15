# Remix Run - WordPress Template Hierarchy

This project shows how Remix Run can be used to re-create the WordPress template hierarchy using WPGraphQL. (if it's even really possible??)

## Run the app

1. Install dependencies by running `npm install` or `yarn`
2. Build the app running `npm run build` or `yarn build`
3. Run the app by running `npm run start` or `yarn start`
4. Visit `http://localhost:3000` in your browser.

You should see something like so:

![Screenshot of the Express App](./docs/img/express-app.png)

## Use the App

Copy the path of any resource from demo.wpgraphql.com and add it as the path to `localhost:3000`.

For example, take the path for the blog post at
`https://demo.wpgraphql.com/blog/tiled-gallery/`

and enter it into your browser like so:

`http://localhost:3000/blog/tiled-gallery/`

You should see the template hierarchy for this path, like so:

![Screenshot of the Express App being used](./docs/img/usage-screenshot.png)
