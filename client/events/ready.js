const Discord = require('discord.js');
/**
 * This event will run if the bot starts, and logs in, successfully.
 */
module.exports = async (client) => {
    try {
        console.log(`${client.user.username} has started with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
        await client.user.setActivity(process.env.activity);
        await client.user.setStatus(process.env.status);
        let embed = await new Discord.RichEmbed()
            .setColor("GREEN")
            .setDescription(`Ready`)
            .setTimestamp();
        let channel = await client.channels.get(process.env.CONSOLELOGID);
        if (!channel || !channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) return;
        await channel.send(embed);
    } catch (err) {
        console.error(err);
    }
};