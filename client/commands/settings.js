const {Servers} = require('../dbObjects');
const {RichEmbed} = require('discord.js');
/**
 * Shows server settings
 */
module.exports.run = async (client, msg) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    if (!msg.member.hasPermission('MANAGE_GUILD')) return;

    // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
    const server = await Servers.findOne({where: {server_id: msg.guild.id}});
    let modRole = await msg.guild.roles.get(server.get('modrole')) || "Empty";
    let modLog = await msg.guild.channels.get(server.get('modlog')) || "Empty";
    let usernameLog = await msg.guild.channels.get(server.get('username')) || "Empty";
    let nicknameLog = await msg.guild.channels.get(server.get('nickname')) || "Empty";
    let deletedLog = await msg.guild.channels.get(server.get('deleted')) || "Empty";
    let editedLog = await msg.guild.channels.get(server.get('edited')) || "Empty";
    let sEmbed = await new RichEmbed()
        .setTitle('Server Settings')
        .setColor("AQUA")
        .addField('Prefix', server.get('prefix'))
        .addField('Mod Role', modRole, true)
        .addField('Mod Log', modLog, true)
        .addField('Username Log', usernameLog, true)
        .addField('Nickname Log', nicknameLog, true)
        .addField('Deleted Messages Log', deletedLog, true)
        .addField('Edited Messages Log', editedLog, true);
    return msg.channel.send(sEmbed);
};

module.exports.help = {
    name: "settings",
    description: "Shows server settings",
    usage: "settings",
    category: "admin"
};