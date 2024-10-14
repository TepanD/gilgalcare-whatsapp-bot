import { connectClient } from "./services/whatsAppWeb/client";
import { writeCredentials } from "./services/googleCredAuthorization/writeCredentials";
import { onMessage } from "./services/whatsAppWeb/api/onMessageEvents";
import { onShutDown } from "./appEvents/onShutDown";
import logger from "./libraries/logger/logger";

export const app = () => {
	try {
		console.log(process.env.NODE_ENV);

		writeCredentials();
		connectClient();
		onMessage();
		onShutDown();
	} catch (err: any) {
		logger.error(err.message, {
			err,
			from: "app()",
		});
	}
};
