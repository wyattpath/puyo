/**
 * Reads messages
 * Ignores bot messages. Only reads messages with prefix at the start
 */
module.exports = async (client, msg) => {
    if (msg.author.bot) return;
    if (msg.channel.type === "dm") return;

    let messageArray = msg.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let prefix = process.env.PREFIX;
    let commandFile;


    if (prefix === cmd.slice(0, prefix.length)) {
        commandFile = await client.commands.get(cmd.slice(prefix.length));
        if (commandFile) await commandFile.run(client, msg, args);
    }
};