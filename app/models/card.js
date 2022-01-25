/* je requiers le module Sequelize pour pouvoir utiliser le Model */
const Sequelize = require("sequelize");
/* je requiers la connexion à la BDD */
const sequelize = require("../database");

class Card extends Sequelize.Model{};

Card.init(
    {
        title: Sequelize.TEXT,
        position:Sequelize.INTEGER,
        color: Sequelize.TEXT,

    },
    {
        /* je donne le nom de ma table*/
        tableName:"card",
        /* je paramètre le connecteur */
        sequelize,
         
    }
);

module.exports = Card;