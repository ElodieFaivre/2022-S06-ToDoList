const { List, Card, Tag } = require('../models');

const mainController = {
   

    async linkTagToCard (req, res) {
        try {
            const tagId = parseInt(req.body.id);
            const cardId = parseInt(req.params.id);

            const tagToLink = await Tag.findByPk(tagId);
            let cardToLink = await Card.findByPk(cardId, {
                include : ['tags']
            });

            if(!tagToLink || !cardToLink){
                return res.status(404).json({ error: 'No card or tag found with id'});
            }

            await cardToLink.addTag(tagToLink);
            cardTolink = await Card.findByPk(cardId, {
                include: ['tags']
              });
            res.status(200).json(cardToLink);

        }
        catch (error) {
            res.status(500).json({message: 'Une erreur est survenue'});
        }
    },

    async removeTagToCard (req, res) {
        try {
            const tagId = parseInt(req.params.tagId);
            const cardId = parseInt(req.params.cardId);

            const tagToLink = await Tag.findByPk(tagId);
            let cardToLink = await Card.findByPk(cardId);

            if(!tagToLink || !cardToLink){
                return res.status(404).json({ error: 'No card or tag found with id'});
            }

            await cardToLink.removeTag(tagToLink);
            cardToLink = await Card.findByPk(cardId, {
                include: ['tags']
              });
            res.status(204).send();

        }
        catch (error) {
            res.status(500).json({message: 'Une erreur est survenue'});
        }
    },

}

module.exports= mainController;
