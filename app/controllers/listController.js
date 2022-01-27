const { List } = require('../models');

const listController = {
    async getAllLists(req, res) {
        try {
            const listArray = await List.findAll({
                include: [
                    {
                        association: 'cards',
                        include: [
                            { association: 'tags' }
                        ]
                    }
                ]
            });
            res.json(listArray);
        }
        catch (error) {
            res.status(500).json(error.toString());
        }

    },

    async createList(req, res) {
        try {
            if (req.body.name) {
                const newList = new List({
                    name: req.body.name

                });
                if (req.body.position) {
                    newList.position = req.body.position
                }

                await newList.save();

                // je renvoie l'instance agrémentée de son id
                // je renvoie une 201 qui veut dire CREATED (cf wikipedia https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP)
                res.status(201).json(newList);
            }
            else {
                res.status(404).json({ error: 'Nom obligatoire' })
            }

        }
        catch (error) {
            res.status(500).json(error.toString());

        }

    },

    async getOneList(req, res) {
        const id = parseInt(req.params.id);
        try {
            const oneList = await List.findByPk(id, {
                include: [
                    {
                        association: 'cards',
                        include: [
                            { association: 'tags' }
                        ]
                    }
                ]
            });
            if (!oneList) {
                return res.status(404).json({ error: 'No list with id ' + req.params.id });
            }
            res.status(200).json(oneList);
        }
        catch (error) {
            console.log(error);
            // je renvoie un code 500 (= erreur serveur) et dans le json, je redonne l'erreur
            res.status(500).json(error.toString());
        }
    },

    async updateList(req, res) {
        const id = parseInt(req.params.id);
        try {
            const oneList = await List.findByPk(id);
            if (!oneList) {
                return res.status(404).json({ error: 'No list with id ' + req.params.id });
            }
            //Autre solution :
            // je donne toutes les clés du body a sequelize,
            // qui s'occupera de modifier les champs un a un
            //await oneList.update(req.body);

            if (req.body.name) {
                oneList.name = req.body.name;
            }
            if (req.body.position) {
                oneList.position = parseInt(req.body.position);
            }
            await oneList.save();
            res.status(200).json(oneList);
        }
        catch (error) {
            console.log(error);
            // je renvoie un code 500 (= erreur serveur) et dans le json, je redonne l'erreur
            res.status(500).json(error.toString());
        }
    },

    async deleteList(req, res) {
        const id = parseInt(req.params.id);
        try {
            const listToDelete = await List.findByPk(id);
            if (!listToDelete) {
                res.status(404).json({ error: 'No list with id ' + req.params.id })
            } else {
                await listToDelete.destroy();
                res.status(204).send();
                //equivalent à res.sendStatus(204)
            }
        }
        catch (error) {
            console.log(error);
            // je renvoie un code 500 (= erreur serveur) et dans le json, je redonne l'erreur
            res.status(500).json(error.toString());
        }
    },
}

module.exports = listController;