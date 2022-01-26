const { Card } = require('../models');

const cardController = {
    async getAllCards(req, res) {
        const cardArray = await Card.findAll({
            include: [
                {  
                    association: 'tags',
                }
            ]
        });
        res.json(cardArray);
    },
    async createCard(req, res) {
        // pour créer une liste, j'ai juste besoin
        // de lui donner un name.
        // ce name, je vais le récupérer dans le body de la requete
        try {
            if (req.body.content && req.body.color && req.body.list_id ) {
                const newCard = new Card({
                    content: req.body.content,
                    color: req.body.color,
                    list_id : req.body.list_id
                });
               
                await newCard.save();

                res.status(201).json(newCard);
            }
            else{
                res.status(404).json({ error: 'Nom, couleur et liste obligatoire' })
            }
        }
        catch (err) {
            res.status(404).json({ error: 'erreur' });
        }

    },
    async getOneCard(req, res) {
        const id = parseInt(req.params.id);
        try {
            const oneCard = await Card.findByPk(id, {
                include: ['tags']
            });
            res.status(201).json(oneCard);
        }
        catch (err) {
            res.status(404).json({ error: 'No such card ' });
        }
    },

    async updateCard(req, res) {
        const id = parseInt(req.params.id);

        try {
            const oneCart = await Card.findByPk(id);
            if (req.body.content) {
                oneCard.content = req.body.content;
            }
            if (req.body.position) {
                oneCard.position = parseInt(req.body.position);
            }
            if (req.body.color) {
                oneCard.color =req.body.color;
            }
            await oneCard.save();
            res.status(200).json(oneCard);
        }
        catch (err) {
            res.status(404).json({ error: 'No such card ' });
        }
    },

    async deleteCard(req, res) {
        const id = parseInt(req.params.id);
        try {
            const oneCard= await Card.findByPk(id);
            await oneCard.destroy();
            res.status(204).send('Supprimé avec succès');
        }
        catch (err) {
            res.status(404).json({ error: 'No such card ' });
        }
    },



}

module.exports = cardController;