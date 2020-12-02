#!/usr/bin/env node
require = require('esm')(module);
require('./src/cli').main(process.argv);