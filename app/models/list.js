const Sequelize = require("sequelize");
const sequelizeConnection = require("../sequelize");

class List extends Sequelize.Model {}

List.init(
    {
        name: Sequelize.STRING,
        position: Sequelize.INTEGER
    },
    {
        sequelize: sequelizeConnection,
        tableName: 'list',
    }
);


module.exports = List;
