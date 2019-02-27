const Discord = require('discord.js');

/**
 * Shows user-info in an embed message
 */
module.exports.run = async (client, msg, args) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    let member = await msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[0]));
    if (!member) member = await msg.member;

    let userIcon = await member.user.displayAvatarURL;
    let memberEmbed = await new Discord.RichEmbed()
        .setDescription("User Information")
        .setColor("AQUA")
        .setThumbnail(userIcon)
        .addField("User Tag", member.user.tag, true)
        .addField("Display Name", member.displayName, true)
        .addField("User Id", member.id, true)
        .addField("Status", member.presence.status, true)
        .addField("Account Created", member.user.createdAt, true)
        .addField("Joined Server", member.joinedAt, true);

    return msg.channel.send(memberEmbed);

};

module.exports.help = {
    name: "userinfo",
    description: "Get user info/stats",
    usage: "userinfo (@user)",
    category: "member"
};