/**
 * Sends a message through the bot
 */
module.exports.run = async (client, msg, args) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    if (!args[0]) return;

    let channel = await msg.channel;
    let message = await args.join(' ');
    await msg.delete();
    if (!msg.channel.permissionsFor(msg.guild.me).has("MANAGE_MESSAGES")) return;
    await channel.send(message);
};

module.exports.help = {
    name: "say",
    description: "Lets the bot say something",
    usage: "say [message]",
    category: "member"
};