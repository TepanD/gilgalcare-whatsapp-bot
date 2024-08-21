// to start with pm2: pm2 start <filename>
module.exports = {
	apps: [
		{
			name: "wa-chatbot",
			script: "./dist/src/index.js",
			shutdown_with_message: true,
			autorestart: false,
			kill_timeout: 5000,
			env: {
				NODE_ENV: "production",
			},
		},
	],
};
