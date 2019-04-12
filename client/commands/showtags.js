const {Tags} = require('../dbObjects');

/**
 * Lists all tags
 */
module.exports.run = async (client, msg) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;

    // equivalent to: SELECT name FROM tags;
    const tagList = await Tags.findAll({attributes: ['name']});
    const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
    return msg.channel.send(`List of tags: ${tagString}`);
};

module.exports.help = {
    name: "showtags",
    description: "lists all tags",
    usage: "showtags",
    category: "member"
};