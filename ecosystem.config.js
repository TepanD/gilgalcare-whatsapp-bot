// to start with pm2: pm2 start <filename>
module.exports = {
	apps: [
		{
			name: "gilgalunicare-wa-chatbot",
			script: "./dist/src/index.js",
			autorestart: false,
			kill_timeout: 5000,
			env_development: {
				NODE_ENV: "development",
			},
			env_production: {
				NODE_ENV: "production",
			},

			//shutdown with message
			//because somehow pm2 "sendSignal SIGINT" command doesn't work.
			shutdown_with_message: true,
		},
	],
};
