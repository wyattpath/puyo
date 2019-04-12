const {Servers} = require('../dbObjects');

/**
 * This event will be emitted whenever the client joins a guild.
 */
module.exports = async (client, guild) => {
    await Servers.sync();
    try {
        // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
        await Servers.create({server_id: guild.id});
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return console.log('That server already exists.');
        }
        return console.log('Something went wrong with adding a server.');
    }
};