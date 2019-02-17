const Discord = require('discord.js');

/**
 * This event will run if the bot tries to reconnect
 */
module.exports = async (client) => {

    let embed = await new Discord.RichEmbed()
        .setColor("ORANGE")
        .setDescription(`Reconnecting`);
    let channel = await client.channels.get(process.env.CONSOLELOGID);
    if(channel && channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")){
        channel.send(embed);
    }
    console.log("Reconnecting");
};