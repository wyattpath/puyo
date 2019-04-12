const {Servers} = require('../dbObjects');

/**
 * Changes a prefix
 */
module.exports.run = async (client, msg, args) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    if (!msg.member.hasPermission('MANAGE_GUILD')) return;
    if(!args[0]) return msg.channel.send('USAGE: prefix [prefix]');

    const newPrefix = args.shift();

    // equivalent to: UPDATE tags (description) values (?) WHERE name = ?;
    const affectedRows = await Servers.update({prefix: newPrefix}, {where: {server_id: msg.guild.id}});
    if (affectedRows > 0) {
        return msg.reply(`Prefix was changed to ${newPrefix}.`);
    }
    return msg.reply(`Could not find a server with the id ${msg.guild.id}.`);
};

module.exports.help = {
    name: "prefix",
    description: "changes the bot prefix",
    usage: "prefix [prefix]",
    category: "admin"
};