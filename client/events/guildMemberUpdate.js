const logger = require('../utils/logger.js');
const {RichEmbed} = require('discord.js');
const {Servers} = require('../dbObjects');

/**
 * This event will run whenever a guild member changes
 */
module.exports = async (client, oldMember, newMember) => {
    if (newMember.user.bot) return;

    try {
        const server = await Servers.findOne({where: {server_id: oldMember.guild.id}});
        const targetLog = await server && await server.get('nickname');
        if (!targetLog) return;

        let nicknameLog = await newMember.guild.channels.get(targetLog);
        if (!nicknameLog) return;
        if (nicknameLog.guild !== newMember.guild) return;
        if (!nicknameLog.guild.available) return;
        if (oldMember.nickname === newMember.nickname) return;
        let embed = await new RichEmbed()
            .setColor("#0x607D8B")
            .setAuthor(newMember.user.tag, newMember.user.displayAvatarURL)
            .setFooter(`UserID: ${newMember.user.id}`)
            .setTimestamp();
        if (oldMember.nickname !== newMember.nickname) {
            embed.setDescription(
                `${newMember} : **${oldMember.nickname}** changed their nickname to **${newMember.nickname}**`);
        }
        return nicknameLog.send(embed);
    } catch(err) {
        logger.error(client, err);
    }

};