const Discord = require('discord.js');

/**
 * Shows server-info in an embed message
 */
module.exports.run = async (client, msg) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;

    let onlineMembers = await msg.guild.members.filter(member => member.presence.status !== "offline");
    let serverIcon = await msg.guild.iconURL;
    let serverEmbed = await new Discord.RichEmbed()
        .setDescription("Server Information")
        .setColor("AQUA")
        .setThumbnail(serverIcon)
        .addField("Server Name", msg.guild.name, true)
        .addField("Server Owner", msg.guild.owner, true)
        .addField("Total Members", msg.guild.memberCount, true)
        .addField("Online Members", onlineMembers.size, true)
        .addField("Created On", msg.guild.createdAt, true);

    await msg.channel.send(serverEmbed);
};

module.exports.help = {
    name: "serverinfo",
    description: "Get server info/stats",
    usage: "serverinfo",
    category: "member"
};