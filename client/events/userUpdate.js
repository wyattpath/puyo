const logger = require('../utils/logger.js');
const {RichEmbed} = require('discord.js');
const {Servers} = require('../dbObjects');

/**
 * This event will run if a User gets updated
 */
module.exports = async (client, oldUser, newUser) => {
    if (newUser.bot) return;
    if (oldUser.username === newUser.username) return;

    try {
        let commonGuilds = await client.guilds.filter(guild => guild.members.has(newUser.id));
        if (!commonGuilds) return;

        await commonGuilds.map(async guild => {
            const server = await Servers.findOne({where: {server_id: guild.id}});
            const targetLog = await server && await server.get('username');
            if (!targetLog) return;
            let usernameLog = await guild.channels.get(targetLog);
            if (!usernameLog) return;

            let embed = await new RichEmbed()
                .setColor("#607D8B")
                .setAuthor(newUser.tag, newUser.displayAvatarURL)
                .setDescription(`${newUser} : **${oldUser.username}** changed their username to **${newUser.username}**`)
                .setFooter(`UserID: ${newUser.id}`)
                .setTimestamp();
            return usernameLog.send(embed);
        })
    } catch (err) {
        logger.error(client, err);
    }
};