/**
 * Reacts to the last message
 */
module.exports.run = async (client, msg, args) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    let emoji = await client.emojis.find(emoji => emoji.name === args[0]);
    if (!emoji) return msg.reply("Couldn't find emoji");

    let fetchedMessage = await msg.channel.fetchMessages({limit: 2});
    let lastMessage = await fetchedMessage.array()[1];
    await lastMessage.react(emoji);

    if (msg.deletable) await msg.delete();
};

module.exports.help = {
    name: "reacttolast",
    description: "Reacts to the last message with the given Emoji Name",
    usage: "reacttolast [emojiName]",
    category: "member"
};