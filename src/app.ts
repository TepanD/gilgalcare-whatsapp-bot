import { connectClient } from "./services/whatsAppWeb/client";
import { writeCredentials } from "./services/googleCredAuthorization/writeCredentials";
import { onMessage } from "./services/whatsAppWeb/api/onMessageEvents";
import birthDateValidation from "./libraries/validation/birthDateValidation";

export const app = ()=>{
    writeCredentials();
    connectClient();
    onMessage();
    // const spreadSheetId = "1I1pBfDcL4-5wH9J-cMCAtMAq5aFHAzWUvId6kwr4_OE";
}
