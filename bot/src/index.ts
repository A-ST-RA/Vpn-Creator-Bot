import { message } from 'telegraf/filters';
import { Telegraf, Markup, Context } from 'telegraf';

import { appConfig } from './config'
import { getMainText, getWelcomeText } from './text/text.service';

const bot = new Telegraf(appConfig.tgBotApi);

bot.start(async (ctx) => {
  const keyboard = Markup.inlineKeyboard([
    Markup.button.callback('👉 Главное меню', 'main'),
  ]);
  
  console.log('start');
  
  const wellcomeText = await getWelcomeText();

  ctx.telegram.sendMessage(
    ctx.from?.id || 0,
    wellcomeText,
    {
      ...keyboard,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    },
  );
});

bot.action('main', async (ctx: Context) => {
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('✅ Подключить VPN', 'connect')],
    [Markup.button.callback('❓ Помощь', 'help')],
    [Markup.button.callback('📜 Инструкция по запуску VPN', 'howToVpn')],
  ]);
  
  const mainText = await getMainText();
  
  console.log('main');
  
  
  ctx.telegram.sendMessage(
    ctx.from?.id || 0,
    mainText,
    {
      ...keyboard,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    },
  );
});

bot.action('help', async (ctx: Context) => {
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url('🤵‍♂️ Перейти в чат технической поддержки', 'https://t.me/A_ST_RA')],
    [Markup.button.callback('👉 Главное меню', 'main')],
  ]);

  
  console.log('help');
  
  const helpText = '<strong>Помощь</strong>\n\nесли вам нужна помощь, можете обратиться к нам в поддержку @A_ST_RA';
  
  ctx.telegram.sendMessage(
    ctx.from?.id || 0,
    helpText,
    {
      ...keyboard,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    },
  );
});

bot.action('howToVpn', async (ctx: Context) => {
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url('📱 WireGuard для Android', 'https://play.google.com/store/apps/details?id=com.wireguard.android&hl=ru&gl=US&pli=1')],
    [Markup.button.url('🍎 WireGuard для Iphone', 'https://apps.apple.com/ru/app/wireguard/id1441195209')],
    [Markup.button.callback('👉 Главное меню', 'main')],
  ]);
  
  console.log('howToVpn');
  

  const howToVpnText = '<strong>Как включить VPN</strong>\n\nТут инструкция о том как запустить VPN';
  
  ctx.telegram.sendMessage(
    ctx.from?.id || 0,
    howToVpnText,
    {
      ...keyboard,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    },
  );
});


bot.on(message('document'), (ctx) => {
  const fromId = ctx.from.id;

  console.log('document');
  
  ctx.reply('Чек получен, ожидайте проверки')
})

bot.action(/buy /, (ctx) => {
  // console.log(ctx.callbackQuery.message);
  
  console.log('buy');
  
  ctx.reply('Заявка создана, отправьте чек по оплате из приложения банка для проверки платежа');
});

bot.action('connect', (ctx) => {
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('🌟 24 месяца: 99 ₽/мес', 'buy 24,99')],
    [Markup.button.callback('12 месяцев: 149 ₽/мес', 'buy 12,149')],
    [Markup.button.callback('👉 Главное меню', 'main')],
  ]);

  console.log('connect');
  
  ctx.telegram.sendMessage(
    ctx.from?.id || 0,
    'Чем больше срок, на который вы покупаете <strong>Название Вашего Бота</strong>, тем больше выгода',
    {
      ...keyboard,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    },
  );
});

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));