const {Tags} = require('../dbObjects');

/**
 * Edits a tag
 */
module.exports.run = async (client, msg, args) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    if (!args[0] || !args[1]) return;

    const tagName = args.shift();
    const tagDescription = args.join(' ');

    // equivalent to: UPDATE tags (description) values (?) WHERE name = ?;
    const affectedRows = await Tags.update({description: tagDescription}, {where: {name: tagName}});
    if (affectedRows > 0) {
        return msg.reply(`Tag ${tagName} was edited.`);
    }
    return msg.reply(`Could not find a tag with name ${tagName}.`);
};

module.exports.help = {
    name: "edittag",
    description: "edits a tag",
    usage: "edittag [tagName] [tagDescription]",
    category: "member"
};