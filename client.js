const Discord = require('discord.js');
const bot = new Discord.Client();
bot.login(process.env.BOT_TOKEN)
const bancho = require('bancho.js')
const osu_client = new bancho.BanchoClient({ username: process.env.BANCHO_USERNAME, password: process.env.BANCHO_PASSWORD, limiterTimespan: 60000, limiterPrivate: 270, limiterPublic: 54 });


module.exports = {
    bot,
    osu_client
}