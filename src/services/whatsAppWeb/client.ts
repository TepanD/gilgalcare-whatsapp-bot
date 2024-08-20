import { Client, LocalAuth } from "whatsapp-web.js";
import { onReady } from "./api/authentication/onReady";
import { onAuthFailure } from "./api/authentication/onAuthFailure";
import { onQrCode } from "./api/authentication/onQrCode";

export const client = new Client({
  authStrategy: new LocalAuth(),
  authTimeoutMs: 60 * 1000,
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    handleSIGINT: false,
  },
});

export const connectClient = async () => {
  client.initialize();

  //generate qr code for waweb connection
  onQrCode();

  //log ready when connection is established
  onReady();

  //log error when connection unsuccessful
  onAuthFailure();
};
