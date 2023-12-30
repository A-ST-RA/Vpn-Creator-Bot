import { config } from 'dotenv';

config();

interface AppConfig {
  tgBotApi: string;
}

export const appConfig: AppConfig = {
  tgBotApi: process.env.TG_BOT_API || '',
};
