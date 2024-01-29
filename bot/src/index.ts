import { message } from 'telegraf/filters';
import { Telegraf, Markup, Context } from 'telegraf';

import { appConfig } from './config'
import { getHelpContent, getHowToVpnText, getMainText, getPhoneNumberText, getPriceList, getPriceSelectorText, getWelcomeText } from './text/text.service';
import { createApplication, getNotAccessedToVpnClients, sendCheck, setKeyToUser } from './applications/applications.service';
import { makeVpnKey } from './vpn/vpn.service';

var cron = require('node-cron');

const bot = new Telegraf(appConfig.tgBotApi);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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
    [Markup.button.url('📱 Outline для Android', 'https://play.google.com/store/apps/details?id=org.outline.android.client&hl=ru&gl=US&pli=1')],
    [Markup.button.url('🖥️ Outline для Windows', 'https://getoutline.org/ru/get-started/#step-3')],
    [Markup.button.url('🖥️ Outline для Mac', 'https://getoutline.org/ru/get-started/#step-3')],
    [Markup.button.url('🍎 Outline для Iphone', 'https://apps.apple.com/ru/app/outline-app/id1356177741')],
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

bot.on(message('document'), async (ctx) => {
  const { href } = await ctx.telegram.getFileLink(ctx.message.document.file_id);
  const fromId = ctx.from.id;

  await sendCheck(fromId, href);
  bot.telegram.sendMessage(appConfig.adminTelegramId, `Пришел новый чек\nid телеграм для поиска в админ панели: ${fromId}`)

  ctx.reply('Чек получен, ожидайте проверки')
})

bot.action(/buy /, async (ctx: any) => {
  const userId = ctx.callbackQuery.from.id;
  const [period, cost] = ctx.callbackQuery.data.split(' ')[1].split(',');
  const phoneNumber = await getPhoneNumberText();

  const result = await createApplication(userId, period, cost);
  if (result) {
    ctx.sendMessage(`Заявка создана\n\nПроизведите оплату в размере ${+period * +cost}₽\nНомер для перевода ${phoneNumber}\n\nДалее отправьте чек из приложения банка для проверки платежа`);
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
    await getPriceSelectorText(),
    {
      ...keyboard,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    },
  );
});

cron.schedule('* * * * *', async () => {
  const data = await getNotAccessedToVpnClients();

  await Promise.all(data?.map(async (el: { telegramId: string | number; id: number; }) => {
    const { accessUrl, id } = await makeVpnKey();
    bot.telegram.sendMessage(el.telegramId, 'Проверка пройдена в следующем сообщении вы получите ссылку на VPN')
    setTimeout(() => {
      bot.telegram.sendMessage(el.telegramId, accessUrl)
    }, 1000)
    await setKeyToUser(el.telegramId.toString(), id);
    return {};
  }));
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));