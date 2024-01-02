import { Telegraf, Markup, Context } from 'telegraf';
import { message } from 'telegraf/filters';

import { appConfig } from './config'

const bot = new Telegraf(appConfig.tgBotApi);

const help = (ctx: Context) => {
  const keyboard = Markup.inlineKeyboard([
    Markup.button.callback('✅ Подключить VPN', 'connect'),
  ]);

  ctx.telegram.sendMessage(
    ctx.from?.id || 0,
    'Главное меню',
    keyboard,  
  );
}

bot.start((ctx) => {
  const keyboard = Markup.inlineKeyboard([
    Markup.button.callback('👉 Главное меню', 'help'),
  ]);
  
  ctx.telegram.sendMessage(
    ctx.from?.id || 0,
    'Главное меню',
    keyboard,  
  );
});

bot.help(help);
bot.action('help', help);

bot.action('connect', (ctx) => {
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('🌟 24 месяца: 99 ₽/мес', '24,99')],
    [Markup.button.callback('12 месяцев: 149 ₽/мес', '24,99')],
    [Markup.button.callback('👉 Главное меню', 'help')],
  ]);

  ctx.telegram.sendMessage(
    ctx.from?.id || 0,
    'Чем больше срок, на который вы покупаете HooliVPN, тем больше скидка.',
    keyboard,  
  );
});

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));