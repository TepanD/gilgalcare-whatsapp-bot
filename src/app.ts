import { client, connectClient } from "./services/whatsAppWeb/client";
import { writeCredentials } from "./services/googleCredAuthorization/writeCredentials";
import { onMessage } from "./services/whatsAppWeb/api/onMessageEvents";
import logger from "./libraries/logger/logger";
import { groupChatId } from "./services/whatsAppWeb/api/groupChat/groupChat";

export const app = ()=>{
    writeCredentials();
    connectClient();
    onMessage();
    onShutDown();
}

const onShutDown = ()=>{
    // keep process running when ctrl+c is pressed
    process.stdin.resume(); 

    // nodejs process POSIX events
    const signals = ["SIGINT", "SIGTERM", "SIGQUIT"];

    signals.forEach(signal =>{
        process.once(signal.toString(), ()=>{
            try{
                exitHandler();
                setTimeout(()=>{
                    process.exit(0);
                }, 3000);
            }
            catch(error: any){
                logger.error("Error during shutdown", {errorMessage: error.message, from: "app.app()"});
                process.exit(1);
            }
        });
    });
}

const exitHandler = async() =>{
    const chatId = await groupChatId();
    await client.sendMessage(chatId, "Whatsapp bot shutting down! Thank you. 👋🥹");
    logger.info("Application shutting down.", { from: "app.exitHandler()" });    
}
