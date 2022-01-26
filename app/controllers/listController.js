const { List } = require('../models');

const listController = {
    async getAllLists(req, res) {
        const listArray = await List.findAll({
            include: [
                {
                    // dans une liste je veux les cards
                    association: 'cards',
                    include: [
                        // et dans ces cards, je veux les tags
                        { association: 'tags' }
                    ]
                }
            ]
        });

        // je renvoie ma data en JSON
        // et... c'est tout !
        // je ne fais pas de vue, c'est le client qui se débrouillera 
        // pour mettre en forme la donnée :)
        res.json(listArray);
    },
    async createList(req, res) {
        // pour créer une liste, j'ai juste besoin
        // de lui donner un name.
        // ce name, je vais le récupérer dans le body de la requete

        const newList = new List({
            name: req.body.name
        });

        // newList va etre sauvegardée
        // et sequelize va noter son id dans l'instance
        await newList.save();

        // je renvoie l'instance agrémentée de son id
        // je renvoie une 201 qui veut dire CREATED (cf wikipedia https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP)
        res.status(201).json(newList);
    }
}

module.exports = listController;