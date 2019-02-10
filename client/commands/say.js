/**
 * Sends a message through the bot
 */
module.exports.run = async (client, msg, args) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    if(!args[0]) return;
    msg.channel.send(args.join(' '))
        .then(() => {
            if (msg.channel.permissionsFor(msg.guild.me).has("MANAGE_MESSAGES")) msg.delete().catch(console.error)
        })
        .catch(console.error);

};

module.exports.help = {
    name: "say",
    description: "Lets the bot say something",
    usage: "say [message]",
    category: "member"
};