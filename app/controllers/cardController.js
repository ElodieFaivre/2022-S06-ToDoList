const { Card } = require('../models');

const cardController = {
    async getAllCards(req, res) {
        try {
            const cardArray = await Card.findAll({
                include: [
                    {
                        association: 'tags',
                    }
                ]
            });
            res.status(200).json(cardArray);
        }
        catch (error) {
            res.status(500).json(error.toString());
        }
    },

    async createCard(req, res) {
        try {
            if (req.body.content && req.body.color && req.body.list_id) {
                const newCard = new Card({
                    content: req.body.content,
                    color: req.body.color,
                    list_id: req.body.list_id
                });

                await newCard.save();

                res.status(201).json(newCard);
            }
            else {
                res.status(404).json({ error: 'Nom, couleur et liste obligatoire' })
            }
        }
        catch (error) {
            res.status(500).json({message: 'Une erreur est survenue'});
        }
    },

    async getOneCard(req, res) {
        const id = parseInt(req.params.id);
        try {
            const oneCard = await Card.findByPk(id, {
                include: ['tags']
            });
            if (!oneCard) {
                return res.status(404).json({ error: 'No card with id ' + req.params.id });
            }
            res.status(200).json(oneCard);
        }
        catch (error) {
            console.log(error);
            // je renvoie un code 500 (= erreur serveur) et dans le json, je redonne l'erreur
            res.status(500).json({message: 'Une erreur est survenue'});
        }
    },

    async updateCard(req, res) {
        const id = parseInt(req.params.id);
        try {
            const oneCard = await Card.findByPk(id);
            if (!oneCard) {
                return res.status(404).json({ error: 'No card with id ' + req.params.id });
            }
            if (req.body.content) {
                oneCard.content = req.body.content;
            }
            if (req.body.position) {
                oneCard.position = parseInt(req.body.position);
            }
            if (req.body.color) {
                oneCard.color = req.body.color;
            }
            await oneCard.save();
            res.status(200).json(oneCard);
        }
        catch (error) {
            console.log(error);
            // je renvoie un code 500 (= erreur serveur) et dans le json, je redonne l'erreur
            res.status(500).json({message: 'Une erreur est survenue'});
        }
    },

    async deleteCard(req, res) {
        const id = parseInt(req.params.id);
        try {
            const cardToDelete = await Card.findByPk(id);
            if (!cardToDelete) {
                res.status(404).json({ error: 'No card with id ' + req.params.id })
            } else {
                await cardToDelete.destroy();
                res.status(204).send();
                //equivalent à res.sendStatus(204)
            }
        }
        catch (error) {
            console.log(error);
            // je renvoie un code 500 (= erreur serveur) et dans le json, je redonne l'erreur
            res.status(500).json({message: 'Une erreur est survenue'});
        }
    },
}

module.exports = cardController;