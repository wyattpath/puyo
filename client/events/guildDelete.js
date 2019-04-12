const {Servers} = require('../dbObjects');

/**
 * This event will be emitted whenever a guild is deleted/left.
 */
module.exports = async (client, guild) => {
    await Servers.sync();
    try {
        // equivalent to: DELETE from tags WHERE name = ?;
        await Servers.destroy({where: {server_id: guild.id}});
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') {
            return console.log('That server is already deleted.');
        }
        return console.log('Something went wrong with deleting a server.');
    }
};