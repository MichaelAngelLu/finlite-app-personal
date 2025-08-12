// packages/app/metro.config.js

// 1. Import the tools
const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('metro-config');
const path = require('path');

// 2. Load the environment variables from the root .env file
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

// 3. Get the default Expo configuration
const defaultConfig = getDefaultConfig(__dirname);

// 4. Merge the default config with our new environment variable settings
module.exports = mergeConfig(defaultConfig, {
  // (any other custom Metro settings could go here)
});