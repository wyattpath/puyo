const logger = require('../utils/logger.js');
const Discord = require('discord.js');
const fs = require("fs");

module.exports.run = async (client, msg) => {
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    await fs.readdir("./client/commands/", (err, files) => {
        if (err) logger.error(client, err, msg);

        let jsfiles = files.filter(f => f.split(".").pop() === "js");
        if (jsfiles.length <= 0) {
            return logger.info(client, "No commands to load!");
        }

        let desclist = "";
        let usage = "";
        let namelist;
        let commands;
        let sEmbed = new Discord.RichEmbed()
            .setTitle("Member Commands")
            .setColor("#15f153");

        // Member commands
        commands = jsfiles.filter((f, props) => {
            props = require(`./${f}`);
            return (props.help.category === 'member');
        });

        commands.forEach((f, props) => {
            props = require(`./${f}`);
            namelist = props.help.name;
            desclist = props.help.description;
            usage = props.help.usage;
            sEmbed.addField(usage, desclist);
        });
        msg.author.send(sEmbed);

        // Mod Commands
        sEmbed = new Discord.RichEmbed()
            .setTitle("Mod Commands")
            .setColor("#ef9c15");
        let embedDescription = "";
        commands = jsfiles.filter((f, props) => {
            props = require(`./${f}`);
            return props.help.category === `mod`;
        });

        commands.forEach((f, props) => {
            props = require(`./${f}`);
            namelist = props.help.name;
            desclist = props.help.description;
            usage = props.help.usage;
            sEmbed.addField(usage, desclist);
        });
        msg.author.send(sEmbed);
        msg.react("👍").catch(err => logger.error(client, err, msg));
        msg.reply("Check DM!");

        if(!msg.member.hasPermission("ADMINISTRATOR")) return;

        // Admin Commands
        sEmbed = new Discord.RichEmbed()
            .setTitle("Admin Commands")
            .setColor("#ff3300");
        embedDescription = "";
        commands = jsfiles.filter((f, props) => {
            props = require(`./${f}`);
            return props.help.category === "admin";
        });

        commands.forEach((f, props) => {
            props = require(`./${f}`);
            namelist = props.help.name;
            desclist = props.help.description;
            usage = props.help.usage;
            embedDescription += `**${usage}** \n ${desclist} \n`;
            //sEmbed.addField(usage, desclist);
        });
        sEmbed.setDescription(embedDescription);
        msg.author.send(sEmbed);

        if (msg.member.id !== process.env.OWNERID) return;

        // Owner Commands
        sEmbed = new Discord.RichEmbed()
            .setTitle("Owner Commands")
            .setColor("DEFAULT");
        embedDescription = "";
        commands = jsfiles.filter((f, props) => {
            props = require(`./${f}`);
            return props.help.category === "owner";
        });

        commands.forEach((f, props) => {
            props = require(`./${f}`);
            namelist = props.help.name;
            desclist = props.help.description;
            usage = props.help.usage;
            embedDescription += `**${usage}** \n ${desclist} \n`;
            //sEmbed.addField(usage, desclist);
        });
        sEmbed.setDescription(embedDescription);
        msg.author.send(sEmbed);
    });
};

module.exports.help = {
    name: "help",
    description: "Show all commands",
    usage: "help",
    category: "member"
};