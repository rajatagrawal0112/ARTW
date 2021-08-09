const mongoose = require('mongoose');

var env = process.env.NODE_ENV || 'test';

if(env === 'development' || env==='test'){

	var config_details = require('./config.json');

	var envConfig = config_details[env];

	Object.keys(envConfig).forEach((key)=>{

		process.env[key] = envConfig[key];

	});

	mongoose.Promise = global.Promise;

	var url = process.env.url;

	mongoose.connect(url);

	module.exports = { mongoose: mongoose};

}
