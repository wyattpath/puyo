const { RichEmbed } = require('discord.js');
const {Servers} = require('../dbObjects');

module.exports.run = async (client, msg, args) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    if (!args[0] || args[0] === "help") return msg.channel.send(" Usage: ban [@user] [reason]");

    let toBan = await (
        msg.mentions.members.first() ||
        msg.guild.members.get(args[0]) ||
        msg.guild.members.find(member => member.displayName === args[0]));
    if (!toBan) return msg.channel.send("Couldn't find user.");
    if (toBan.user === msg.author) return msg.channel.send("You can't ban yourself.");
    const toBanUser = await toBan.user;

    if (!toBan.bannable) return msg.channel.send("I don't have permission to do that.");

    let modRole;
    let canBan;
    let server = await Servers.findOne({where: {server_id: msg.guild.id}});

    let targetRoleId = await server && server.get('modrole');
    if (targetRoleId) {
        modRole = await msg.guild.roles.get(targetRoleId);
        if (toBan.roles.has(modRole.id)) return msg.channel.send("You can't ban this member");
        canBan = await (!toBan.roles.has(modRole.id) && msg.member.roles.has(modRole.id));
    }

    let hasPermission = await toBan.bannable && msg.member.hasPermission("BAN_MEMBERS") && !toBan.hasPermission("BAN_MEMBERS");
    if (!hasPermission && !canBan) return msg.channel.send("Missing permissions");

    let reason = await args[1] ? args.slice(1).join(' ') : `Unspecified`;
    if (reason.length >= 512) {
        const rEmbed = await new RichEmbed()
            .setTitle(`ERROR: Message too long`)
            .setColor(`RED`)
            .setDescription(`The reason message is too long! Please dont make it longer than 512 characters!`);
        return msg.channel.send(rEmbed);
    }

    await toBan.ban(reason);

    let rMessage = await msg.channel.send(`${toBanUser} has been banned because **${reason}**.`);
    rMessage.delete(5000);

    // modlog
    let targetLogId = await server.get('modlog');
    if (targetLogId) {
        let sEmbed = await new RichEmbed()
            .setAuthor(`[BAN] ${toBanUser.tag}`, toBanUser.displayAvatarURL)
            .setColor(`#f44242`) // red
            .addField(`User`, toBanUser, true)
            .addField(`Moderator`, msg.author, true)
            .setTimestamp()
            .addField(`Reason`, reason, true);

        let channel = await msg.guild.channels.get(targetLogId);
        channel && channel.send(sEmbed);
    }

    await toBanUser.send(`Hey, sorry about this but... you got banned from **${msg.guild.name}** for **${reason}**.`);
    msg.deletable && await msg.delete();
};

module.exports.help = {
    name: "ban",
    description: "Bans a member from the server",
    usage: "ban <@user> (reason)",
    category: "mod"
};
