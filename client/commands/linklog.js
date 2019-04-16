const Discord = require('discord.js');
const {Servers} = require('../dbObjects');

/**
 * Link a channel
 * @param client
 * @param msg
 * @param {string} args channel id
 */
module.exports.run = async (client, msg, args) => {
    // checks if message author has manage guild permission and if bot can send messages
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    if (!msg.member.hasPermission("MANAGE_GUILD")) {
        return msg.reply("You need the Manage Server permission to do that");
    }

    if (!args[0] || args[0] === "help" || !args[1]) {
        let embed = await new Discord.RichEmbed()
            .setColor("AQUA")
            .setDescription(
                '**link [logType][#channel]** to link a logType (modlog, username, nickname, deleted) to a channel\n' +
                'ex: `linklog modlog #modlog`'
            );
        return msg.reply(embed);
    }


    let server = await Servers.findOne({where: {server_id: msg.guild.id}});
    if (!server) return msg.channel.send(`Couldn't find server`);
    let logType = await args[0];
    let attribute = await server.rawAttributes[logType];
    if (!attribute) return msg.channel.send(`Log type ${logType} doesn't exist`);

    let color, title, description;

    let targetChannel = await (
        msg.guild.channels.find(channel => channel.name === args[1]) ||
        msg.mentions.channels.first() ||
        msg.guild.channels.get(args[1]));
    if (!targetChannel) {
        color = await "RED";
        title = await `ERROR 404 : ${logType} Not Found!`;
        description = await `Could not find channel ${args[1]}.`;
    } else if (!targetChannel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) {
        color = await "RED";
        title = await `Missing permission`;
        description = await `I don't have permission to send messages to ${targetChannel}.`;
    } else {
        const affectedRows = await Servers.update(
            {[logType]: targetChannel.id},
            {where: {server_id: msg.guild.id}});
        if (affectedRows > 0) {
            color = await "GREEN";
            title = await `${logType} linked`;
            description = await `${logType} linked to ${targetChannel}`;
        } else {
            color = await "RED";
            title = await `ERROR 404 : ${logType} Not Found!`;
            description = await `Could not find logType ${logType} with ID ${targetChannel.id}.`;
        }
    }

    let sEmbed = await new Discord.RichEmbed()
        .setColor(color)
        .setTitle(title)
        .setDescription(description);

    await msg.channel.send(sEmbed);
};

module.exports.help = {
    name: "linklog",
    description: "Link a channel",
    usage: "linklog [logType] [#channel]",
    category: "admin"
};