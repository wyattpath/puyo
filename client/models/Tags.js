module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tags', {
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        description: DataTypes.TEXT,
        username: DataTypes.STRING,
        usage_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    })
};