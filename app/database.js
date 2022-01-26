
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.PG_URL,{
    define: {
        //Partout les tables sont en underscore
        underscored:true,
    

    },
});

module.exports = sequelize;