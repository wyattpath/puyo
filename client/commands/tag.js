const {Tags} = require('../dbObjects');

/**
 * Fetches a tag
 */
module.exports.run = async (client, msg, args) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    if (!args[0]) return;
    const tagName = args[0];

    // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
    const tag = await Tags.findOne({ where: { name: tagName } });
    if (tag) {
        // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
        tag.increment('usage_count');
        return msg.channel.send(tag.get('description'));
    }
    return msg.reply(`Could not find tag: ${tagName}`);
};

module.exports.help = {
    name: "tag",
    description: "fetches a tag",
    usage: "tag [tagName]",
    category: "member"
};