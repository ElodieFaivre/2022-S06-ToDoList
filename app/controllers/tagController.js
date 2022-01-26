const { Tag } = require('../models');

const tagController = {
    async getAllTags(req, res) {
        const tagArray = await Tag.findAll({
            include: ['cards']
        });
        res.json(tagArray);
    },
    async createTag(req, res) {
        // pour créer une liste, j'ai juste besoin
        // de lui donner un name.
        // ce name, je vais le récupérer dans le body de la requete
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
        catch (err) {
            res.status(404).json({ error: 'Erreur dans la création ' });
        }

    },
    async getOneTag(req, res) {
        const id = parseInt(req.params.id);
        try {
            const oneTag = await Tag.findByPk(id, {
                include: ['cards']
            });
            res.status(201).json(oneTag);
        }
        catch (err) {
            res.status(404).json({ error: 'No such tag ' });
        }
    },

    async updateTag(req, res) {
        const id = parseInt(req.params.id);

        try {
            const oneTag = await Tag.findByPk(id);
            if (req.body.name) {
                oneList.name = req.body.name;
            }
            if (req.body.color) {
                oneList.color = parseInt(req.body.color);
            }
            await oneTag.save();
            res.status(200).json(oneTag);
        }
        catch (err) {
            res.status(404).json({ error: 'No such tag ' });
        }
    },

    async deleteTag(req, res) {
        const id = parseInt(req.params.id);
        try {
            const oneTag = await Tag.findByPk(id);
            await oneTag.destroy();
            res.status(204).send('Supprimé avec succès');
        }
        catch (err) {
            res.status(404).json({ error: 'No such tag ' });
        }
    },



}

module.exports = tagController;