const logger = require('../utils/logger.js');
const {RichEmbed} = require('discord.js');
const {Servers} = require('../dbObjects');

/**
 * This event will run if a message gets updated
 */
module.exports = async (client, oldmsg, newmsg) => {
    if (newmsg.author.bot) return;
    if (!newmsg.guild.available) return;

    try {
        // log updated message in actionlog if set
        let server = await Servers.findOne({where: {server_id: oldmsg.guild.id}});
        let targetLog = await server && await server.get('edited');
        if (!targetLog) return;

        let editedLog = await newmsg.guild.channels.get(targetLog);
        if (!editedLog) return;
        if (!editedLog.permissionsFor(newmsg.guild.me).has("SEND_MESSAGES")) return;
        if (editedLog.guild !== newmsg.guild) return;
        let embed = await new RichEmbed()
            .setColor("#607D8B")
            .setAuthor(newmsg.author.tag, newmsg.author.displayAvatarURL)
            .setDescription(`**Message edited in ${newmsg.channel}**`)
            .setFooter(`UserID: ${newmsg.author.id}`)
            .setTimestamp();
        if (oldmsg.content) {
            // splits content into arrays in case message content length exceeds 1024 characters
            let oldMessages = await oldmsg.content.match(/(.|[\r\n]){1,1023}/g);
            for (let i = 0; i < oldMessages.length; i++) {
                await embed.addField(`Before[${i + 1}/${oldMessages.length}]`, `${oldMessages[i]}`);
            }
            let newMessages = await newmsg.content.match(/(.|[\r\n]){1,1023}/g);
            for (let i = 0; i < newMessages.length; i++) {
                await embed.addField(`After[${i + 1}/${newMessages.length}]`, `${newMessages[i]}`);
            }
        }
        return editedLog.send(embed);
    } catch (err) {
        logger.error(client, err);
    }
};