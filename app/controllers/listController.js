const {List} = require('../models');

const listController ={

    async getAllLists (req,res) {
        const listArray = await List.findAll({
            include: [{
                association :'cards',
                include:['tags']
            }]
        });
        //Pas de vue, le client se débrouillera avec le JSON
        res.json(listArray);
    },

    async createList(req,res){
        const newList = new List({
            name : req.body.name
        });
        await newList.save();

        // status 201 veut dire created
        res.status(201).json(newList);
    }
}

module.exports=listController;