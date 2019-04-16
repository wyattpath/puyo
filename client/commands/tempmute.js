const Discord = require("discord.js");
const ms = require('ms');
const {Servers} = require('../dbObjects');

module.exports.run = async (client, msg, args) => {
    if (!args[1] || !args[0]) return msg.channel.send("tempmute <@user> <1s/m/h/d> (reason)");
    if (!msg.guild.me.hasPermission("MANAGE_ROLES")) {
        return msg.channel.send('I need Manage Roles Permissions to do that');
    }
    let toMute = await (
        msg.mentions.members.first() ||
        msg.guild.members.get(args[0]) ||
        msg.guild.members.find(member => member.displayName === args[0]));
    if (!toMute) return msg.channel.send("Couldn't find user.");
    if (toMute.user === client.user) return msg.channel.send("You can't use this command on me!");
    if (toMute.user === msg.author) return msg.channel.send("You can't use this command on yourself.");

    let server = await Servers.findOne({where: {server_id: msg.guild.id}});
    // check if modrole is setup
    let modRoleId = await server && await server.get('modRole_id');
    let canMute;

    if (modRoleId) {
        const modRole = await msg.guild.roles.get(modRoleId);
        if (!modRole) return msg.channel.send("Couldn't find modrole");
        if (toMute.roles.has(modRole.id)) return msg.channel.send("You can't mute this user!");
        canMute = await !toMute.roles.has(modRole.id) && msg.member.roles.has(modRole.id);
    }

    let hasPermission = await
        !toMute.hasPermission("MANAGE_MESSAGES") && (
        msg.member.hasPermission("BAN_MEMBERS") ||
        msg.member.hasPermission("KICK_MEMBERS"));
    if (!hasPermission && !canMute) {
        return msg.channel.send("You can't do that, bruuh!");
    }

    let muteRole = await msg.guild.roles.find(role => role.name === "Muted");
    // If no muteRole, create one
    if (!muteRole) {
        muteRole = await msg.guild
            .createRole({
                name: "Muted",
                color: "#818386",
                permissions: []
            });

        await msg.guild.channels.forEach(async channel => {
            await channel.overwritePermissions(muteRole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
            });
        });
    }

    // give member muteRole
    let muteTime = await args[1];
    if (!muteTime) return msg.reply("You didn't specify a time!");

    let reason = await args[2] ? args.slice(2).join(" ") : `Unspecified`;
    await toMute.addRole(muteRole);
    msg.channel.send(`${toMute} has been muted for **${ms(ms(muteTime))}** because of **${reason}**.`);

    // log in modLog if set up
    let modLogId, channel, sEmbed;
    let targetLogId = server.get('modlog');
    if (targetLogId) {
        channel = await msg.guild.channels.get(targetLogId);
        if (!channel) msg.channel.send("modLog channel with ID couldn't be found");

        sEmbed = await new Discord.RichEmbed()
            .setAuthor(`[TEMPMUTE] ${toMute.user.tag}`, toMute.user.avatarURL)
            .setColor(`#ef9c15`) // orange
            .addField(`User`, toMute)
            .addField(`Moderator`, msg.author, true)
            .addField(`Reason`, reason, true)
            .addField(`Duration`, ms(ms(muteTime)))
            .setTimestamp();

        channel.send(sEmbed);
    }

    // unmute
    setTimeout(async () => {
        if (!toMute.roles.has(muteRole.id)) return;
        await toMute.removeRole(muteRole.id);
        msg.channel.send(`${toMute} has been unmuted!`);

        modLogId = await server.get('modlog');
        if (!modLogId) return;
        channel = await msg.guild.channels.get(modLogId);
        if (!channel) return msg.reply("modLog channel with ID couldn't be found");

        sEmbed = await new Discord.RichEmbed()
            .setColor(`#50f442`)
            .setAuthor(`[UNMUTE] ${toMute.user.tag}`, toMute.user.avatarURL)
            .addField(`User`, toMute)
            .addField(`Moderator`, client.user)
            .setTimestamp();

        channel.send(sEmbed);
    }, ms(muteTime));
};

module.exports.help = {
    name: "tempmute",
    description: "tempmutes someone for a specific time",
    usage: "tempmute <@user> <1s/m/h/d> (reason)",
    category: "mod"
};
