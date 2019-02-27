/**
 * Sends a "Pong" message back with ping time
 */
module.exports.run = async (client, msg) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    return msg.channel.send("Pong: " + client.ping + " ms");
};

module.exports.help = {
    name: "ping",
    description: "Checks if Bot is online",
    usage: "ping",
    category: "member"
};