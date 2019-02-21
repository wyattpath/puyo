const Discord = require('discord.js');

/**
 * This event will run if the bot fails to reconnect and stays disconnected
 */
module.exports = async (client) => {

    try {
        let embed = await new Discord.RichEmbed()
            .setColor("RED")
            .setDescription(`Disconnected!`);
        let channel = await client.channels.get(process.env.CONSOLELOGID);
        if (!channel || !channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) return;
        await channel.send(embed);
        console.log("Disconnected");
    } catch (err) {
        console.error(err);
    }
};