/**
 * Sends a message through the bot
 */
module.exports.run = async (client, msg, args) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    if (!args[0]) return;

    let channel = await msg.channel;
    let message = await args.join(' ');
    if (msg.deletable) await msg.delete();
    await channel.send(message);
};

module.exports.help = {
    name: "say",
    description: "Lets the bot say something",
    usage: "say [message]",
    category: "member"
};