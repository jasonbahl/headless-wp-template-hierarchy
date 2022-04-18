/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: [".*"],
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  serverBuildPath: "build/index.js",
  publicPath: "/build/",
  // routes(defineRoutes) {
  //   return defineRoutes((route) => {
  //     console.log({
  //       route
  //     })
  //     route("*", "WordPressNode.jsx");
  //   })
  // }
};
