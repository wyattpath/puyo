const {Servers} = require('../dbObjects');

/**
 * This event will be emitted whenever the client joins a guild.
 */
module.exports = async (client, guild) => {
    await Servers.sync();
    try {
        // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
        await Servers.create({server_id: guild.id});
        let embed = await new Discord.RichEmbed()
            .setColor("GREEN")
            .setTitle(`Server added`)
            .setDescription(`Puyo added to Server ${guild.name} ! Puyo is now on ${client.guilds.size} servers!`)
            .addField(`Owner`, guild.owner, true)
            .addField(`Server ID`, guild.id, true)
            .addField(`Server Size`, guild.memberCount, true)
            .setTimestamp();
        let channel = await client.channels.get(process.env.CONSOLELOGID);
        if (!channel || !channel.permissionsFor(channel.guild.me).has("SEND_MESSAGES")) return;
        await channel.send(embed);
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return console.log('That server already exists.');
        }
        return console.log('Something went wrong with adding a server.');
    }
};