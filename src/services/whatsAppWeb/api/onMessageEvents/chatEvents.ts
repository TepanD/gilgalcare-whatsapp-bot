import { Message } from "whatsapp-web.js";

export const clearMessages = async (msg: Message)=>{
    const chat = msg.getChat();
    const clearResult = (await chat).clearMessages();
}

const chatEvents = {
    clearMessages
}

export default chatEvents;