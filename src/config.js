import { config } from "dotenv";
config();

export const READ_MAIL_CONFIG = {
  imap: {
    user: process.env.EMAIL,
    password: process.env.PASSWORD,
    host: 'imap.gmail.com',
    port: 993,
    authTimeout: 10000,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  },
};

export const CONFIG = {
  CHECK_MAIL_INTERVAL_SECONDS: process.env.CHECK_MAIL_INTERVAL_SECONDS * 1000 || 60000,
  EMAIL_SENDERS_LIST: process.env.EMAIL_SENDERS_LIST.split(", ") || [],
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
}