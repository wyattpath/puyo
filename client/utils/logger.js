const {RichEmbed} = require('discord.js');
const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'log'}),
    ],
    format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
});

module.exports = {
    info(client, info) {
        logger.log('info', info);

        let channel = getChannel(client);

        let emb = new RichEmbed()
            .setColor("GREEN")
            .setDescription(info)
            .setTimestamp();

        return channel.send(emb);
    },
    warn(client, warn) {
        logger.log('warn', warn);

        let channel = getChannel(client);

        let emb = new RichEmbed()
            .setColor("ORANGE")
            .setDescription(warn)
            .setTimestamp();

        return channel.send(emb);
    },
    debug(client, error) {
        logger.log('debug', error);
    },
    error(client, error, msg) {
        // winston
        logger.log('error', error);

        // send in channel
        let channel = client.channels.get(process.env.LOGCHANNELID);
        if (!channel) return console.log("ERROR: Couldn't find puyolog!");

        let emb = new RichEmbed()
            .setColor("RED")
            .setDescription(error.stack)
            .setTimestamp();
        if (msg) {
            // splits content into arrays in case message content length exceeds 1024 characters
            let contents = msg.content.match(/(.|[\r\n]){1,1023}/g);
            for (let content in contents) {
                emb.addField(msg.guild.name, contents[content]);
            }
        }
        channel.send(emb);
        channel.send(`@here`)
            .then(m => m.delete(3000))
            .catch(err => console.error(err));
    }
};

const getChannel = (client) => {
    const channel = client.channels.get(process.env.LOGCHANNELID);
    return (!channel) ? console.log("ERROR: Couldn't find puyolog!") : channel;
};