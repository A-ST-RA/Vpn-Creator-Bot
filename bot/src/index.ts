import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

import { appConfig } from './config'

const bot = new Telegraf(appConfig.tgBotApi)
bot.start((ctx) => ctx.reply('Привет! Пришли мне стикер'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))