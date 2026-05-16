require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {

    ctx.reply(
        '🚀 Welcome To GovMiner',
        Markup.inlineKeyboard([
            [
                Markup.button.webApp(
                    '⛏ Open Mining',
                    'https://govminer.netlify.app/'
                )
            ]
        ])
    );

});

bot.launch();

console.log('Bot Running...');
