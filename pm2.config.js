// to start with pm2: pm2 start <filename>
module.exports = {
	apps: [
		{
			name: "gilgalunicare-wa-chatbot",
			script: "./build/index.js",
			autorestart: false,
			restart_delay: 3000,
			kill_timeout: 5000,
			stop_exit_codes: [0],
			env: {
				NODE_ENV: "production",
			},

			//find root of node_modules folder with `npm root -g`
			//format: <npm root path>/bun/bin/bun.exe
			interpreter:
				"C:/Users/STEFAN-CARBON/AppData/Roaming/npm/node_modules/bun/bin/bun.exe",

			//shutdown with message
			//because somehow pm2 "sendSignal SIGINT" command doesn't work.
			shutdown_with_message: true,
		},
	],
};
