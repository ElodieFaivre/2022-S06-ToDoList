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
        try{
            if(req.body.name){
                const newList = new List({
                    name: req.body.name
                    
                });
                if(req.body.position){
                     newList.position= req.body.position
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
        catch(err){
            res.status(404).json({ error: 'Erreur dans la création '});
        }
        
    },
    async getOneList(req,res) {
        const id = parseInt(req.params.id);
        try{
            const oneList = await List.findByPk(id, {
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
            res.json(oneList);
        }
        catch(err){
            res.status(404).json({ error: 'No such list '});
        }
    },

    async updateList(req, res){
        const id = parseInt(req.params.id);
        
        try{
            const oneList = await List.findByPk(id);
            if(req.body.name){
                oneList.name = req.body.name;
            }
            if(req.body.position){
                oneList.position = parseInt(req.body.position);
            }
            await oneList.save();
            res.status(200).json(oneList);
        }
        catch(err){
            res.status(404).json({ error: 'No such list '});
        }
    },

    async deleteList(req,res) {
        const id = parseInt(req.params.id);
        try{
            const oneList = await List.findByPk(id, {
                include: [
                    {
                        // dans une liste je veux les cards
                        association: 'cards',
                        
                    }
                ]
            });
            await oneList.destroy();
            res.status(204).json('Supprimé avec succès');
        }
        catch(err){
            res.status(404).json({ error: 'No such list '});
        }
    },
  


}

module.exports = listController;