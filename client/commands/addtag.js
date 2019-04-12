const {Tags} = require('../dbObjects');

/**
 * Adds a tag
 */
module.exports.run = async (client, msg, args) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    if (!args[0] || !args[1]) return;
    const tagName = args.shift();
    const tagDescription = args.join(' ');
    try {
        // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
        const tag = await Tags.create({
            name: tagName,
            description: tagDescription,
            username: msg.author.username,
        });
        return msg.reply(`Tag ${tag.name} added.`);
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return msg.reply('That tag already exists.');
        }
        return msg.reply('Something went wrong with adding a tag.');
    }
};

module.exports.help = {
    name: "addtag",
    description: "add a tag",
    usage: "addtag [tag]",
    category: "member"
};