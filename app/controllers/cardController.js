const { Card } = require('../models');

const cardController = {
    async getAllCardsInList(req, res) {
        try {
            const listId = parseInt(req.params.id);
            const cardArray = await Card.findAll({
                where: {
                    list_id: listId
                },
                include: [
                    {
                        association: 'tags',
                    }
                ],
                order:[
                    ['position','ASC'],
                    ['position','DESC']
                ]
                  
            });
            if (!cardArray) {
                res.status(404).json('Cant find cards with list_id ' + listId);
            } else {
                res.status(200).json(cardArray);
            }
        }
        catch (error) {
            res.status(500).json(error.toString());
        }
    },

    async createCard(req, res) {
        try {
            console.log(req.body);
            if (req.body.content  && req.body.list_id) {
                const newCard = new Card({
                    content: req.body.content,
                    list_id: req.body.list_id
                });
                if(req.body.color){
                    newCard.color=req.body.color;
                }
            
                await newCard.save();
                
                res.status(201).json(newCard);
            }
            else {
                res.status(400).json({ error: 'Nom et liste obligatoire' })
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Une erreur est survenue' });
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
            res.status(500).json({ message: 'Une erreur est survenue' });
        }
    },

    async updateCard(req, res) {
        const id = parseInt(req.params.id);
        try {
            console.log(req.body);
            const oneCard = await Card.findByPk(id, {
                include : ['tags']
            });
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
            if (req.body.list_id) {
                oneCard.list_id = req.body.list_id;
            }
            await oneCard.save();
            res.status(200).json(oneCard);
        }
        catch (error) {
            console.log(error);
            // je renvoie un code 500 (= erreur serveur) et dans le json, je redonne l'erreur
            res.status(500).json({ message: 'Une erreur est survenue' });
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
            res.status(500).json({ message: 'Une erreur est survenue' });
        }
    },

    createOrUpdate: async (req, res) => {
        try {
          let card;
          if (req.params.id) {
            card = await Card.findByPk(req.params.id);
          }
          if (card) {
            await cardController.updateCard(req, res);
          } else {
            await cardController.createCard(req, res);
          }
        } catch (error) {
          console.trace(error);
          res.status(500).send(error);
        }
      },
}

module.exports = cardController;