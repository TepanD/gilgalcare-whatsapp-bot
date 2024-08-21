import logger from "../../../../libraries/logger/logger";
import { client } from "../../client";

export const onAuthFailure = () => {
  client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    logger.error('Failed on authenticating WhatsApp client.', { msg, from: "onAuthFailure()" });
});
};
