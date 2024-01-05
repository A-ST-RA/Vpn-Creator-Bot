import { Telegraf, Markup, Context } from 'telegraf';

import { appConfig } from './config'
import { getMainText, getWelcomeText } from './text/text.service';

const bot = new Telegraf(appConfig.tgBotApi);

const mainContent = async (ctx: Context) => {
  const keyboard = Markup.inlineKeyboard([
    Markup.button.callback('✅ Подключить VPN', 'connect'),
  ]);
  
  const mainText = await getMainText();
  
  ctx.telegram.sendMessage(
    ctx.from?.id || 0,
    mainText,
    {
      ...keyboard,
      parse_mode: 'HTML',
    },
  );
}

bot.start(async (ctx) => {
  const keyboard = Markup.inlineKeyboard([
    Markup.button.callback('👉 Главное меню', 'main'),
  ]);
  
  const wellcomeText = await getWelcomeText();

  ctx.telegram.sendMessage(
    ctx.from?.id || 0,
    wellcomeText,
    {
      ...keyboard,
      parse_mode: 'HTML',
    },
  );
});

bot.action('main', mainContent);

bot.action('connect', (ctx) => {
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('🌟 24 месяца: 99 ₽/мес', '24,99')],
    [Markup.button.callback('12 месяцев: 149 ₽/мес', '24,99')],
    [Markup.button.callback('👉 Главное меню', 'main')],
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