const dotenv = require('dotenv');
dotenv.config();

const {Card, List, Tag} = require('./app/models');

async function test() {
    //Test des listes
    const lists = await List.findAll();
    console.log('##########################');
    console.log('LISTES',lists);

    //Test des cartes
    const cards = await Card.findAll();
    console.log('##########################');
    console.log('CARTES',cards);


    //Test des tags
    const tags = await Tag.findAll();
    console.log('##########################');
    console.log('TAGS',tags);

    //Test des relations
    //Test de la relation carte-tags
    const cardWithTags = await Card.findByPk(1,{
        include:['tags'] 
    });
    console.log('##########################');
    console.log('CARTES AVEC tags',cardWithTags);
    for(const tag of cardWithTags.tags){
        console.log('Tags de la carte 1 :',tag.name);
    }
    

    //Test de la relation tag-card
    const Tag1 = await Tag.findByPk(1, {
        include:['cards'],
    });
    for(const card of Tag1.cards){
        console.log('Carte avec le tag 1 :',card.title);
    }

    //Test de la relation list-card
    const cardsInList3 = await Card.findAll({
        where:{
            list_id : 3,
        }
    });
    for(const cardElement of cardsInList3){
        console.log('Carte dans la liste 3 :',cardElement.title);
    }


};

test();