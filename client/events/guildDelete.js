const {Servers} = require('../dbObjects');

/**
 * This event will be emitted whenever a guild is deleted/left.
 */
module.exports = async (client, guild) => {
    await Servers.sync();
    try {
        // equivalent to: DELETE from tags WHERE name = ?;
        const rowCount = await Servers.destroy({where: {server_id: guild.id}});
        if (!rowCount) return msg.reply('That tag did not exist.');
        let embed = await new Discord.RichEmbed()
            .setColor("RED")
            .setTitle(`Server removed`)
            .setDescription(`Puyo removed from Server ${guild.name} ! Puyo is now on ${client.guilds.size} servers!`)
            .addField(`Owner`, guild.owner, true)
            .addField(`Server ID`, guild.id, true)
            .addField(`Server Size`, guild.memberCount, true)
            .setTimestamp();
        let channel = await client.channels.get(process.env.CONSOLELOGID);
        if (channel && channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) {
            return channel.send(embed);
        }
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return console.log('That server is already deleted.');
        }
        return console.log('Something went wrong with deleting a server.');
    }
};