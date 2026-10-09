const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
if (!config.resolver.assetExts.includes('wasm')) config.resolver.assetExts.push('wasm');
const middlewareAnterior = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware, server) => {
  const app = middlewareAnterior ? middlewareAnterior(middleware, server) : middleware;
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    return app(req, res, next);
  };
};
module.exports = config;
