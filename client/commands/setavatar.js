/**
 * Sets avatar to given URL
 */
module.exports.run = async (client, msg, args) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return "";
    if (msg.member.id !== process.env.OWNERID) {
        return msg.reply("You can't use this command");
    }
    if (!args[0]) {
        return msg.reply("Usage: setavatar [URL]");
    }

    await client.user.setAvatar(args[0]);
    return msg.reply(`Avatar set to ${args}`);
};

module.exports.help = {
    name: "setavatar",
    description: "Sets avatar to given URL to image",
    usage: "setavatar [URL]",
    category: "owner"
};
