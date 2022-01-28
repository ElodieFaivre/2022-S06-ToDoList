const { Tag } = require('../models');

const tagController = {
    async getAllTags(req, res) {
        try {
            const tagArray = await Tag.findAll({
                include: ['cards']
            });
            res.json(tagArray);
        }
        catch (error) {
            res.status(500).json({message: 'Une erreur est survenue'});
        }
    },

    async createTag(req, res) {
        
        try {
            if (req.body.name && req.body.color) {
                const newTag = new Tag({
                    name: req.body.content,
                    color: req.body.color,
                });

                await newTag.save();

                res.status(201).json(newTag);
            }
            else {
                res.status(404).json({ error: 'Nom et couleur obligatoire' })
            }
        }
        catch (error) {
            res.status(500).json({message: 'Une erreur est survenue'});
        }

    },

    async getOneTag(req, res) {
        const id = parseInt(req.params.id);
        try {
            const oneTag = await Tag.findByPk(id, {
                include: ['cards']
            });
            if (!oneTag) {
                return res.status(404).json({ error: 'No tag with id ' + req.params.id });
            }
            res.status(200).json(oneTag);
        }
        catch (error) {
            res.status(500).json({message: 'Une erreur est survenue'});
        }

    },

    async updateTag(req, res) {
        const id = parseInt(req.params.id);

        try {
            const oneTag = await Tag.findByPk(id);
            if (!oneTag) {
                return res.status(404).json({ error: 'No tag with id ' + req.params.id });
            }
            if (req.body.name) {
                oneTag.name = req.body.name;
            }
            if (req.body.color) {
                oneTag.color = parseInt(req.body.color);
            }
            await oneTag.save();
            res.status(200).json(oneTag);
        }
        catch (error) {
            res.status(500).json({message: 'Une erreur est survenue'});
        }
    },

    async deleteTag(req, res) {
        const id = parseInt(req.params.id);
        try {
            const tagToDelete = await Tag.findByPk(id);
            if (!tagToDelete) {
                res.status(404).json({ error: 'No tag with id ' + req.params.id })
            } else {
                await tagToDelete.destroy();
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

module.exports = tagController;