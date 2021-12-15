/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: "app",
  browserBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "build",
  devServerPort: 8002,
  routes: async (defineRoutes) => {
    console.log( { defineRoutes })
    return defineRoutes((route) => {
      route("/*", "routes/$url.jsx")
    })
  }
};
