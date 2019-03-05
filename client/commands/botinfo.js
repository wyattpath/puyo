const {RichEmbed} = require('discord.js');


/**
 * Shows bot-info in an embed message
 */
module.exports.run = async (client, msg) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;

    let totalSeconds = await (client.uptime / 1000);
    let days = await Math.floor(totalSeconds / 86400);
    let hours = await Math.floor(totalSeconds / 3600);
    totalSeconds %= await 3600;
    let minutes = await Math.floor(totalSeconds / 60);
    let seconds = await totalSeconds % 60;

    let uptime = await `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    let botIcon = await client.user.displayAvatarURL;
    let botEmbed = await new RichEmbed()
        .setColor("GREEN")
        .setThumbnail(botIcon)
        .addField(`Bot Name`, client.user.username, true)
        .addField(`Developer`, `Zhias#7772`, true)
        .addField(`Servers`, `${client.guilds.size}`, true)
        .addField(`Users`, `${client.users.size}`, true)
        .addField(`Uptime`, `${uptime}`, true)
        .addField(`Bot created`, client.user.createdAt, true)
        .addField(`Prefix: `, `p!`)
        .setTimestamp();

    return msg.channel.send(botEmbed);
};

module.exports.help = {
    name: "botinfo",
    description: "Get bot info/stats",
    usage: "botinfo",
    category: "member"
};