/* je requiers le module Sequelize pour pouvoir utiliser le Model */
const Sequelize = require("sequelize");
/* je requiers la connexion à la BDD */
const sequelize = require("../database");

class List extends Sequelize.Model{};

List.init(
    {
        name: Sequelize.TEXT,
        position:Sequelize.INTEGER
    },
    {
        /* je donne le nom de ma table*/
        tableName:"list",
        /* je paramètre le connecteur */
        sequelize,
         
    }
);

module.exports = List;