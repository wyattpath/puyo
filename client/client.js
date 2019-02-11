const Discord = require('discord.js');
const fs = require('fs');
let client = new Discord.Client();
client.commands = new Discord.Collection();

/**
 * Loads commandfiles in command folder
 */
fs.readdir("./client/commands/", async (err, files) => {
    if (err) console.error(err);
    let jsfile = await files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        console.log("Couldn't find commands.");
        return;
    }

    await jsfile.forEach((f) => {
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
    await files.forEach(async file => {
        const event = await require(`./events/${file}`);
        let eventName = await file.split(".")[0];
        await client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

module.exports = client;
