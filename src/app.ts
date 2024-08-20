import { client, connectClient } from "./services/whatsAppWeb/client";
import { writeCredentials } from "./services/googleCredAuthorization/writeCredentials";
import { onMessage } from "./services/whatsAppWeb/api/onMessageEvents";
import logger from "./libraries/logger/logger";
import { groupChatId } from "./services/whatsAppWeb/api/groupChat/groupChat";

export const app = ()=>{
    writeCredentials();
    connectClient();
    onMessage();

    // keep process running when ctrl+c is pressed
    process.stdin.resume(); 

    // execute when ctrl+c is pressed
    process.once("SIGINT", ()=>{
        try{
            exitHandler();
        }
        catch(error: any){
            console.error("Error during shutdoown: ", error.message);
            process.exit(1);
        }
    });
}

const exitHandler = async() =>{
    const chatId = await groupChatId();
    logger.info(chatId);
    await client.sendMessage(chatId, "Whatsapp bot shutting down! Thank you. 👋🥹");
    logger.info("Application shutting down.");    
    // process.exit(0);  
}
