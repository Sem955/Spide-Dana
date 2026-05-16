require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    '🚀 Selamat Datang di GovMiner',
    Markup.keyboard([
      [
        Markup.button.webApp(
          '⛏ Penambangan Terbuka',
          'https://govminer.netlify.app'
        )
      ]
    ]).resize()
  );
});

bot.launch();

console.log('Bot berhasil aktif');
