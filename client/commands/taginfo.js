const {Tags} = require('../dbObjects');

/**
 * Displays info about a tag
 */
module.exports.run = async (client, msg, args) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    if (!args[0]) return;
    const tagName = args[0];

    // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
    const tag = await Tags.findOne({ where: { name: tagName } });
    if (tag) {
        return msg.channel.send(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
    }
    return msg.reply(`Could not find tag: ${tagName}`);
};

module.exports.help = {
    name: "taginfo",
    description: "displays info about a tag",
    usage: "taginfo [tagName]",
    category: "member"
};