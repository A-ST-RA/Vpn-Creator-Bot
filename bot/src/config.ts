import { config } from 'dotenv';

config();

interface AppConfig {
  tgBotApi: string;
  backendUrl: string;
  vpnUrl: string;
  adminTelegramId: string;
}

export const appConfig: AppConfig = {
  tgBotApi: process.env.TG_BOT_API || '',
  backendUrl: process.env.BACKEND_URL || '',
  vpnUrl: process.env.VPN_URL || '',
  adminTelegramId: process.env.ADMIN_TELEGRAM_ID || '',
};
