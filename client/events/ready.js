const Discord = require('discord.js');
const {Tags} = require('../dbObjects');
const {Servers} = require('../dbObjects');

/**
 * This event will run if the bot starts, and logs in, successfully.
 */
module.exports = async (client) => {
    try {
        await client.user.setActivity(process.env.activity);
        await client.user.setStatus(process.env.status);
        await Tags.sync();
        await Servers.sync();
        const guildArray = await client.guilds.array();
        let guild, i;
        for (i = 0; i < guildArray.length; i++) {
            guild = await guildArray[i];
            let server = await Servers.findOne({where: {server_id: guild.id}});
            if (!server) {
                console.log(i);
                await Servers.create({server_id: guild.id});
            }
            console.log(" - " + guild.name);
        }
        await console.log(`${client.user.username} has started with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

        let embed = await new Discord.RichEmbed()
            .setColor("GREEN")
            .setTitle(`Ready`)
            .setDescription(`${client.user.username} has started with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`)
            .setTimestamp();
        let channel = await client.channels.get(process.env.LOGCHANNELID);
        if (!channel || !channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) return;
        await channel.send(embed);
    } catch (err) {
        console.log(err);
    }
};