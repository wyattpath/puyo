"use strict";
const Discord = require('discord.js');
const {Servers} = require('../dbObjects');

/**
 * Sets up a mod role
 * @param client
 * @param msg
 * @param {string} args roleID
 */
module.exports.run = async (client, msg, args) => {
    // checks if message author has manage guild permission and if bot can send messages
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.reply("You need the Manage Server permission to do that");

    let sEmbed = await new Discord.RichEmbed();
    let description = await "";
    let title = await "";
    let color = await "";

    let server = await Servers.findOne({where: {server_id: msg.guild.id}});
    if (!server) return msg.channel.send(`Couldn't find server`);
    let modRoleId = server.get('modRole_id');
    let modrole;
    if (!args[0] || args[0] === "help") {
        if (modRoleId) modrole = await msg.guild.roles.get(modRoleId);
        color = await "AQUA";
        title = await `Mod Role Usage`;
        description = await `**modrole [roleID]** to link a role
                **modrole unlink** to unlink a role`
            + (modrole ? `\nCurrent modrole is set to ${modrole}` : ``);
    } else if (args[0] === "unlink") {
        if (!modRoleId) {
            color = await "RED";
            title = await "ERROR 404 : Mod Role Not Found!";
            description = await `No Mod Role set.`;
        } else {
            const affectedRows = await Servers.update(
                {modRole_id: null},
                {where: {server_id: msg.guild.id}});
            if (affectedRows > 0) {
                color = await "GREEN";
                title = await "Mod Role unlinked!";
                description = await `Mod Role with ID ${modRoleId} has been unlinked.`;
            } else {
                color = await "RED";
                title = await "ERROR 404 : Mod Role Not Found!";
                description = await `Could not find Mod Role with ID ${modRoleId}.`;
            }
        }
    } else {
        let targetId = await msg.guild.roles.get(args[0]);
        let targetName = await msg.guild.roles.find(role => role.name === args[0]);
        let targetMention = await msg.mentions.roles.first();
        let targetRole = await (targetId || targetName || targetMention);
        if (!targetRole) {
            color = await "RED";
            title = await "ERROR 404 : Mod Role Not Found!";
            description = await `Could not find Mod Role ${args[0]}.`;
        } else {
            const affectedRows = await Servers.update(
                {modRole_id: targetRole.id},
                {where: {server_id: msg.guild.id}});
            if (affectedRows > 0) {
                color = await "GREEN";
                title = await "Mod Role linked!";
                description = await `Mod Role linked to ${targetRole.name}`;
            } else {
                color = await "RED";
                title = await "ERROR 404 : Mod Role Not Found!";
                description = await `Could not find Mod Role with ID ${targetRole.id}.`;
            }
        }
    }

    await sEmbed.setTitle(title)
        .setColor(color)
        .setDescription(description);
    await msg.channel.send(sEmbed);
};

module.exports.help = {
    name: "modrole",
    description: "Sets mod role",
    usage: "modrole [rolelID]",
    category: "admin"
};