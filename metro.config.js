const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
const resolverPadrao = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "crypto") {
    return { type: "empty" };
  }
  const resolver = resolverPadrao || context.resolveRequest;
  return resolver(context, moduleName, platform);
};

module.exports = config;
