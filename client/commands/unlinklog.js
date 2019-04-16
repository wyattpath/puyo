const Discord = require('discord.js');
const {Servers} = require('../dbObjects');

/**
 * Unlink a channel
 * @param client
 * @param msg
 * @param {string} args channel id
 */
module.exports.run = async (client, msg, args) => {
    // checks if message author has manage guild permission and if bot can send messages
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    if (!msg.member.hasPermission("MANAGE_GUILD")) {
        return msg.reply("You need the Manage Server permission to do that");
    }

    if (!args[0] || args[0] === "help") {
        let embed = await new Discord.RichEmbed()
            .setColor("AQUA")
            .setTitle("Usage")
            .setDescription(
                '**unlink [logType]** unlink a logType(modlog)\n' +
                'ex: `unlinklog modlog`');
        return msg.reply(embed);
    }

    let server = await Servers.findOne({where: {server_id: msg.guild.id}});
    if (!server) return msg.channel.send(`Couldn't find server`);
    let logType = await args[0];
    let attribute = await server.rawAttributes[logType];
    if (!attribute) return msg.channel.send(`Log type ${logType} doesn't exist`);

    let color, title, description;
    const affectedRows = await Servers.update(
        {[logType]: null},
        {where: {server_id: msg.guild.id}});
    if (affectedRows > 0) {
        color = await "GREEN";
        title = await `${logType} unlinked`;
        description = await `${logType} successfully unlinked!`;
    } else {
        color = await "RED";
        title = await `ERROR 404 : ${logType} Not Found`;
        description = await `There is no ${logType} linked!`;
    }

    let sEmbed = await new Discord.RichEmbed()
        .setColor(color)
        .setTitle(title)
        .setDescription(description);

    await msg.channel.send(sEmbed);
};

module.exports.help = {
    name: "unlinklog",
    description: "Unlink a channel",
    usage: "unlinklog [logType]",
    category: "admin"
};