'use strict';

const path = require('path');
const { createStrapi } = require('@strapi/core');

const appDir = path.resolve(__dirname);
const distDir = path.resolve(__dirname, 'dist');

createStrapi({ appDir, distDir }).start();
