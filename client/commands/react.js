/**
 * Sends a reaction
 */
module.exports.run = async (client, msg, args) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;

    let emoji = await client.emojis.find(emoji => emoji.name === args[0]) || client.emojis.get(args[0]);
    if (!emoji) return msg.reply("Couldn't find emoji.");
    await msg.channel.send(`${emoji}`);
    if (!msg.channel.permissionsFor(msg.guild.me).has("MANAGE_MESSAGES")) return;
    await msg.delete();

};

module.exports.help = {
    name: "react",
    description: "Sends a reaction with the given Emoji Name.ex.: react gifcolorheart",
    usage: "react [emojiName]",
    category: "member"
};