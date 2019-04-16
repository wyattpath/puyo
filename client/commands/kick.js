const Discord = require('discord.js');
const {Servers} = require('../dbObjects');

/**
 * Kick a member
 */
module.exports.run = async (client, msg, args) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    let toKick = await (
        msg.mentions.members.first() ||
        msg.guild.members.get(args[0]) ||
        msg.guild.members.find(member => member.displayName === args[0]));
    if (!toKick) return msg.channel.send("Couldn't find user.");
    if (!toKick.kickable) return msg.channel.send("I don't have permission to do that.");

    let modRole;
    let canKick;
    let server = await Servers.findOne({where: {server_id: msg.guild.id}});

    let targetRoleId = await server && await server.get('modRole_id');
    if (targetRoleId) {
        modRole = await msg.guild.roles.get(targetRoleId);
        canKick = await (!toKick.roles.has(modRole.id) && msg.member.roles.has(modRole.id));
        if (!canKick) return msg.reply("You can't do that, bruuh!");
    }
    let hasPermission = await (!toKick.hasPermission("KICK_MEMBERS") && msg.member.hasPermission("KICK_MEMBERS"));
    if (!hasPermission && !canKick) return msg.reply("Missing permissions");

    if (toKick.user === client.user) return msg.channel.send("You can't use this command on me!");
    if (toKick.user === msg.author) return msg.channel.send("You can't use this command on yourself.");

    const reason = await args[1] ? args.slice(1).join(' ') : 'Unspecified';
    const toKickUser = await toKick.user;
    await toKick.kick(reason);
    await msg.channel.send(`<@${toKickUser.id}> has been kicked because of **${reason}**.`);

    let modLogId = await server.get('modlog');
    if (modLogId) {
        let sEmbed = await new Discord.RichEmbed()
            .setAuthor(`[KICK] ${toKickUser.tag}`, toKickUser.displayAvatarURL)
            .setColor(`#f44242`) // red
            .addField(`User`, toKickUser)
            .addField(`Moderator`, msg.author)
            .setTimestamp();
        if (args[1]) sEmbed.addField(`Reason`, args.slice(1).join(' '));

        let channel = await msg.guild.channels.get(modLogId);
        if (!channel) return;
        return channel
            .send(sEmbed)
            .catch(() => msg.reply("Couldn't access modLog. Missing permission?"));
    }
};

module.exports.help = {
    name: "kick",
    description: "Kicks a member from the server",
    usage: "kick <@user> (reason)",
    category: "mod"
};