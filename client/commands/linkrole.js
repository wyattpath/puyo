const Discord = require('discord.js');
const {Servers} = require('../dbObjects');

/**
 * Link a role
 * @param client
 * @param msg
 * @param {string} args role to link
 */
module.exports.run = async (client, msg, args) => {
    // checks if message author has manage guild permission and if bot can send messages
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
    if (!msg.member.hasPermission("MANAGE_GUILD")) {
        return msg.reply("You need the Manage Server permission to do that");
    }

    if (!args[0] || args[0] === "help" || !args[1]) {
        let embed = await new Discord.RichEmbed()
            .setColor("AQUA")
            .setDescription(
                '**link [roleType][#channel]** to link a roleType (modrole) to a role\n' +
                'ex: `linkrole modrole @mod`'
            );
        return msg.reply(embed);
    }

    let server = await Servers.findOne({where: {server_id: msg.guild.id}});
    if (!server) return msg.channel.send(`Couldn't find server`);
    let roleType = await args[0];
    let attribute = await server.rawAttributes[roleType];
    if (!attribute) return msg.channel.send(`Role type ${roleType} doesn't exist`);

    let color, title, description;

    let targetRole = await (
        msg.guild.roles.find(role => role.name === args[1]) ||
        msg.mentions.roles.first() ||
        msg.guild.roles.get(args[1]));
    if (!targetRole) {
        color = await "RED";
        title = await `ERROR 404 : ${roleType} Not Found!`;
        description = await `Could not find role ${args[1]}.`;
    } else {
        const affectedRows = await Servers.update(
            {[roleType]: targetRole.id},
            {where: {server_id: msg.guild.id}});
        if (affectedRows > 0) {
            color = await "GREEN";
            title = await `${roleType} linked`;
            description = await `${roleType} linked to ${targetRole}`;
        } else {
            color = await "RED";
            title = await `ERROR 404 : ${roleType} Not Found!`;
            description = await `Could not find roleType ${roleType} with ID ${targetRole.id}.`;
        }
    }

    let sEmbed = await new Discord.RichEmbed()
        .setColor(color)
        .setTitle(title)
        .setDescription(description);

    await msg.channel.send(sEmbed);
};

module.exports.help = {
    name: "linkrole",
    description: "Link a role",
    usage: "linkrole [roleType] [@role]",
    category: "admin"
};