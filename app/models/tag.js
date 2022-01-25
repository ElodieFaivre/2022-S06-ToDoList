/* je requiers le module Sequelize pour pouvoir utiliser le Model */
const Sequelize = require("sequelize");
/* je requiers la connexion à la BDD */
const sequelize = require("../database");

class Tag extends Sequelize.Model{};

Tag.init(
    {
        name: Sequelize.TEXT,
        color: Sequelize.TEXT,

    },
    {
        /* je donne le nom de ma table*/
        tableName:"tag",
        /* je paramètre le connecteur */
        sequelize,
         
    }
);

module.exports = Tag;