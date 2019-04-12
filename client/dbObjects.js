const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    ssl: true,
    dialectOptions: {ssl: true}
});

const Tags = sequelize.import('models/Tags');
const Servers = sequelize.import('models/Servers');

module.exports = {Tags, Servers };