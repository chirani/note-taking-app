const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Bundle Drizzle migration files as strings.
config.resolver.sourceExts.push("sql");

module.exports = config;
