#!/usr/bin/env node

// Cronicle Server - Main entry point
// Copyright (c) 2015 - 2022 Joseph Huckaby
// Released under the MIT License

// Emit warning for broken versions of node v10
// See: https://github.com/jhuckaby/Cronicle/issues/108
if (process.version.match(/^v10\.[012345678]\.\d+$/)) {
	console.error("\nWARNING: You are using an incompatible version of Node.js (" + process.version + ") with a known timer bug.\nCronicle will stop working after approximately 25 days under these conditions.\nIt is highly recommended that you upgrade to Node.js v10.9.0 or later, or downgrade to Node LTS (v8.x).\nSee https://github.com/jhuckaby/Cronicle/issues/108 for details.\n");
}

const PixlServer = require("pixl-server");
const fs = require('fs');

// resolve secret key and config file
let config_file = fs.existsSync('/run/secrets/config.json') ? "/run/secrets/config.json" : "conf/config.json";
let secret_key_file = process.env['CRONICLE_secret_key_file'] || '/run/secrets/secret_key';
if(fs.existsSync(secret_key_file)) process.env['CRONICLE_secret_key'] = fs.readFileSync(secret_key_file).toString().trim();


// chdir to the proper server root dir
process.chdir( require('path').dirname( __dirname ) );

const server = new PixlServer({
	
	__name: 'Cronicle',
	__version: require('../package.json').version,
	
	configFile: config_file,
	
	components: [
		require('pixl-server-storage'),
		require('pixl-server-web'),
		require('pixl-server-api'),
		require('./user.js'),
		require('./engine.js')
	]
	
});

server.startup( function() {
	// server startup complete
	process.title = server.__name + ' Server';
} );
