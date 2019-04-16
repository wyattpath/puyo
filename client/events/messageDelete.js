const logger = require('../utils/logger.js');
const {RichEmbed} = require('discord.js');
const {Servers} = require('../dbObjects');

/**
 * This event will run if a message gets updated
 */
module.exports = async (client, msg) => {
    if (msg.author.bot) return;
    if(!msg.guild.available) return;

    try {
        let server = await Servers.findOne({where: {server_id: msg.guild.id}});
        let targetLog = await server && await server.get('deleted');
        if (!targetLog) return;

        let deletedLog = await msg.guild.channels.get(targetLog);
        if (!deletedLog) return;
        if (deletedLog.guild !== msg.guild) return;
        if (!deletedLog.permissionsFor(msg.guild.me).has("VIEW_CHANNEL")) return;
        if (!deletedLog.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;
        if (!deletedLog.permissionsFor(msg.guild.me).has("VIEW_AUDIT_LOG")) {
            return deletedLog.send(`I need View Audit Log permissions!`);
        }

        const entry = await msg.guild
            .fetchAuditLogs({
                type: 'MESSAGE_DELETE'
            })
            .then(audit => audit.entries.first())
            .catch(err => logger.error(client, err));

        // Checks who deleted the message and assigns it to the user
        let user = (entry.extra.channel.id === msg.channel.id &&
            (entry.target.id === msg.author.id) &&
            (entry.createdTimestamp > (Date.now() - 5000) &&
                entry.extra.count >= 1)) ? entry.executor : msg.author;

        let embed = await new RichEmbed()
            .setColor(`#f44336`) // Red
            .setAuthor(user.tag, user.displayAvatarURL)
            .setDescription(`**Message sent by ${msg.author} deleted by ${user} in ${msg.channel}**`)
            .setFooter(`UserID: ${user.id}`)
            .setTimestamp();
        msg.content && await embed.addField(`Message`, `${msg.content}`);
        return deletedLog.send(embed);
    } catch (err) {
        logger.error(client, err);
    }
};