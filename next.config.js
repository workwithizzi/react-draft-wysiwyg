const withCSS = require("@zeit/next-css");

const ENV = require("./env");

module.exports = 
	withCSS({
		env: {
			MONGO_SRV: ENV.MONGO_SRV,
			DB_NAME: ENV.DB_NAME,
		},
		cssModules: false,
	});
