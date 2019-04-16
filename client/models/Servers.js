module.exports = (sequelize, DataTypes) => {
    return sequelize.define('servers', {
        server_id: {
            type: DataTypes.STRING,
            unique: true
        },
        prefix: {
            type: DataTypes.STRING,
            defaultValue: 'p!',
            allowNull: false
        },
        modRole_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        modlog: {
            type: DataTypes.STRING,
            allowNull: true
        },
    })
};