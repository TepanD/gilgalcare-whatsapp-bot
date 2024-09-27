import { connectClient } from "./services/whatsAppWeb/client";
import { writeCredentials } from "./services/googleCredAuthorization/writeCredentials";
import { onMessage } from "./services/whatsAppWeb/api/onMessageEvents";
import { onShutDown } from "./appEvents/onShutDown";

export const app = () => {
	try {
		writeCredentials();
		connectClient();
		onMessage();
		onShutDown();
	} catch (e: any) {
		console.log(e.message);
	}
};
