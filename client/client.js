const Discord = require('discord.js');
const fs = require('fs');
const logger = require('./utils/logger.js');

let client = new Discord.Client();
client.commands = new Discord.Collection();

/**
 * Loads commandFiles in command folder
 */
fs.readdir("./client/commands/", async (err, files) => {
    if (err) console.error(err);
    let jsFile = await files.filter(f => f.split(".").pop() === "js");
    if (jsFile.length <= 0) {
        console.log("Couldn't find commands.");
        return;
    }

    await jsFile.forEach((f) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded`);
        client.commands.set(props.help.name, props);
        delete require.cache[require.resolve(`./commands/${f}`)];
    });
});

/**
 * Loads event files in event folder
 */
fs.readdir("./client/events/", async (err, files) => {
    if (err) return console.error(err);
    let file;
    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        file = files[fileIndex];
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    }
});

client.on("error", (e) => logger.error(client, e));
client.on("warn", (e) => logger.warn(client, e));
client.on("debug", (e) => logger.debug(client, e));

process.on('uncaughtException', error => logger.error(client, error));
process.on("unhandledRejection", (reason, promise) => {
    console.warn(
        "Unhandled promise rejection:",
        promise,
        "reason:",
        reason.stack || reason
    );
});

module.exports = client;
