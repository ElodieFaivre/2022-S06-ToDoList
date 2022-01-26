// un peu comme on faisait avec le client pg
// on va récupérer la classe Sequelize
const { Sequelize } = require('sequelize');

// dont nous allons faire une instance
// on parlera de notre CLIENT SEQUELIZE
// on lui donne l'url de la base de donnée
const sequelize = new Sequelize(process.env.PG_URL, {
    define: {
        updatedAt: 'updated_at',
        createdAt: 'created_at'
    }
});

// que l'on exporte
module.exports = sequelize;