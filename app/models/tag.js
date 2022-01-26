const Sequelize = require("sequelize");
const sequelizeConnection = require("../sequelize");

class Tag extends Sequelize.Model {}

Tag.init(
    {
        name: Sequelize.STRING,
        color: Sequelize.STRING
    },
    {
        sequelize: sequelizeConnection,
        tableName: 'tag',
    }
);


module.exports = Tag;
