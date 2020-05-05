const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    "/nearbysearch",
    createProxyMiddleware({
      target: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?",
      changeOrigin: true,
    })
  );
  app.use(
    "/textsearch",
    createProxyMiddleware({
      target: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?",
      changeOrigin: true,
    })
  );
};