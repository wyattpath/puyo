const logger = require('../utils/logger.js');

/**
 * Reads messages
 * Ignores bot messages. Only reads messages with prefix at the start
 */
module.exports = async (client, msg) => {
    if (msg.author.bot) return;
    if (msg.channel.type === "dm") return;

    try {
        let messageArray = await msg.content.split(" ");
        let cmd = await messageArray[0].toLowerCase();
        let args = await messageArray.slice(1);
        let prefix = await process.env.PREFIX;

        if (prefix !== cmd.slice(0, prefix.length)) return;
        let commandFile = await client.commands.get(cmd.slice(prefix.length));
        if (!commandFile) return;
        await commandFile.run(client, msg, args);
    } catch (err) {
        logger.error(client, err, msg);
    }
}
;