import { message } from 'telegraf/filters';
import { Telegraf, Markup, Context } from 'telegraf';

import { appConfig } from './config'
import { getHelpContent, getHowToVpnText, getMainText, getPriceList, getWelcomeText } from './text/text.service';
import { createApplication } from './applications/applications.service';

const bot = new Telegraf(appConfig.tgBotApi);

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
  const {helpText, helpLink} = await getHelpContent();
  
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url('🤵‍♂️ Перейти в чат технической поддержки', helpLink)],
    [Markup.button.callback('👉 Главное меню', 'main')],
  ]);
  
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
  
  const howToVpnText = await getHowToVpnText();
  
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

  ctx.reply('Чек получен, ожидайте проверки')
})

bot.action(/buy /, async (ctx: any) => {
  const userId = ctx.callbackQuery.from.id;
  const [period, cost] = ctx.callbackQuery.data.split(' ')[1].split(',');

  const result = await createApplication(userId, period, cost);
  if (result) {
    ctx.reply('Заявка создана, отправьте чек по оплате из приложения банка для проверки платежа');
    return;
  }

  ctx.reply('Произошла ошибка, повторите попытку позже');
});

bot.action('connect', async (ctx) => {
  const priceList = await getPriceList();
  
  const buyKeyboardData = priceList?.map((el, idx) => {
    let text = `${el.duration} мес: ${el.cost} ₽/мес`;
    let callback = `buy ${el.duration},${el.cost}`;

    if (idx === 0) {
      text = `🌟 ${text}`;
    }

    return [Markup.button.callback(text, callback)];
  })

  const keyboard = Markup.inlineKeyboard([
    ...buyKeyboardData as any,
    [Markup.button.callback('👉 Главное меню', 'main')],
  ]);

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