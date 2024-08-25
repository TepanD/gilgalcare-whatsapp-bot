import type { Message } from "whatsapp-web.js";

export const clearMessages = async (msg: Message) => {
	const chat = msg.getChat();
	(await chat).clearMessages();
};

const chatEvents = {
	clearMessages,
};

export default chatEvents;
