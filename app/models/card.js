const Sequelize = require("sequelize");
const sequelizeConnection = require("../sequelize");

class Card extends Sequelize.Model {}

Card.init(
    {
        content: Sequelize.STRING,
        color: Sequelize.STRING,
        position: Sequelize.INTEGER
    },
    {
        sequelize: sequelizeConnection,
        tableName: 'card',
    }
);


module.exports = Card;
