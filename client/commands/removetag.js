const {Tags} = require('../dbObjects');

/**
 * Removes a tag
 */
module.exports.run = async (client, msg, args) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    if (!args[0]) return;

    // equivalent to: DELETE from tags WHERE name = ?;
    const tagName = args[0];
    const rowCount = await Tags.destroy({where: {name: tagName}});
    if (!rowCount) return msg.reply('That tag did not exist.');

    return msg.reply('Tag deleted.');

};

module.exports.help = {
    name: "removetag",
    description: "removes a tag",
    usage: "removetag [tag]",
    category: "member"
};