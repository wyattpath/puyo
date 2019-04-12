"use strict";
const {Servers} = require('../dbObjects');
const Discord = require('discord.js');

/**
 * Sets modlog channel for server
 * @param client
 * @param msg
 * @param {string} args modlogchannel id
 */
module.exports.run = async (client, msg, args) => {
    // checks if message author has manage guild permission and if bot can send messages
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.reply("You need the Manage Server permission to do that");

    let server = await Servers.findOne({where: {server_id: msg.guild.id}});
    if (!server) return msg.channel.send(`Couldn't find server`);
    let modLogId = server.get('modLog_id');

    let color, title, description;
    let targetChannel;
    if (!args[0] || args[0] === "help") {
        if (modLogId) targetChannel = await msg.guild.channels.get(modLogId);
        let embed = await new Discord.RichEmbed()
            .setColor("AQUA")
            .setDescription(`**modlog [channel]** to link a channel
            **modlog unlink** to unlink a channel`+
                (targetChannel ? `\nCurrent modlogchannel is set to ${targetChannel}` : ``));
        await msg.reply(embed);
    } else if (args[0] === "unlink") {
        if (!modLogId) {
            color = await "RED";
            title = await "ERROR 404 : Mod Log Not Found!";
            description = await `No Mod Log linked.`;
        } else {
            const affectedRows = await Servers.update(
                {modLog_id: null},
                {where: {server_id: msg.guild.id}});
            if (affectedRows > 0) {
                color = await "GREEN";
                title = await "Mod Log unlinked!";
                description = await `Mod Log with ID ${modLogId} has been unlinked.`;
            } else {
                color = await "RED";
                title = await "ERROR 404 : Mod Log Not Found!";
                description = await `Could not find Mod Log with ID ${modLogId}.`;
            }
        }
        let sEmbed = await new Discord.RichEmbed()
            .setColor(color)
            .setTitle(title)
            .setDescription(description);
        return msg.channel.send(sEmbed);
    } else {
        let channelFound = await msg.guild.channels.find(channel => channel.name === args[0]);
        let channelMentioned = await msg.mentions.channels.first();
        let channelGotten = await msg.guild.channels.get(args[0]);
        targetChannel = await (channelFound || channelMentioned || channelGotten);
        if (!targetChannel) {
            color = await "RED";
            title = await "ERROR 404 : Mod Log Not Found!";
            description = await `Could not find Log ${args[0]}.`;
        } else {
            const affectedRows = await Servers.update(
                {modLog_id: targetChannel.id},
                {where: {server_id: msg.guild.id}});
            if (affectedRows > 0) {
                color = await "GREEN";
                title = await "Mod Log linked!";
                description = await `Mod Role linked to ${targetChannel.name}`;
            } else {
                color = await "RED";
                title = await "ERROR 404 : Mod Log Not Found!";
                description = await `Could not find Mod Log with ID ${targetChannel.id}.`;
            }
        }

        let sEmbed = await new Discord.RichEmbed()
            .setColor(color)
            .setTitle(title)
            .setDescription(description);

        await msg.channel.send(sEmbed);
    }
};

module.exports.help = {
    name: "modlog",
    description: "Link a channel for modlogs ",
    usage: "modlog [channel]",
    category: "admin"
};