
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.PG_URL,{
    define: {
        //Partout les tables sont en underscore
        underscored:true,
        //Pour ne pas créer les colonnes createdAt UpdatedAt
        timestamps: false

    },
});

module.exports = sequelize;