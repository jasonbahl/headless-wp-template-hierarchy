# WPGraphQL Template Hierarchy Debugger

This is a project to demonstrate how to re-create the WordPress template hierarchy with Headless WordPress using WPGraphQL.

This project is built on NodeJS using ExpressJS.

When visiting a URL, a `nodeByUri` GraphQL query is sent to WPGraphQL, and in response the Node is returned with information about the node.

The information about the node is then used to map to template files.

This technique could be used to route the node to an appropriate React Component, Vue Component, or other template file to render the data.
