/**
 * Sends a reaction
 */
module.exports.run = async (client, msg, args) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    let emoji = await client.emojis.find(emoji => emoji.name === args[0]) || client.emojis.get(args[0]);
    if (!emoji) return msg.reply("Couldn't find emoji")
        .then(m => {
            m.delete(5000)
                .catch(console.error);
        });

    if (!msg.channel.permissionsFor(msg.guild.me).has("MANAGE_MESSAGES")) return;
    msg.channel.send(`${emoji}`)
        .then(msg.delete())
        .catch(console.error);
};

module.exports.help = {
    name: "react",
    description: "Sends a reaction with the given emojiname. Use this command for customemojis `ex: react gifcolorheart`",
    usage: "react [emojiname]",
    category: "member"
};