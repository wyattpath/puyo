const {Servers} = require('../dbObjects');

/**
 * Lists all servers
 */
module.exports.run = async (client, msg) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    if (!(msg.member.id === process.env.OWNERID)) return msg.reply("You can't use this command");

    // equivalent to: SELECT name FROM tags;
    const serverList = await Servers.findAll({attributes: ['server_id']});
    const serverString = serverList.map(server => server.name).join(', ') || 'No tags set.';
    return msg.channel.send(`List of servers: ${serverString}`);
};

module.exports.help = {
    name: "guilds",
    description: "lists all guilds",
    usage: "guilds",
    category: "owner"
};