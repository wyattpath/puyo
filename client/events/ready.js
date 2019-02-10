/**
 * This event will run if the bot starts, and logs in, successfully.
 */
module.exports = async (client) => {
    await console.log(`${client.user.username} has started with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    await client.user.setActivity(process.env.activity).catch(console.error);
    client.user.setStatus(process.env.status).catch(console.error);
};