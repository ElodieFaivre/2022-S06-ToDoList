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
    // List-cards-tag
    const listArray = await List.findAll({
        include: [{
            association :'cards',
            include:['tags']
        }]
    });

    console.log('voici les listes : ', listArray);
    for (const list of listArray) {
        for (const card of list.cards) {
            console.log('jai une carte : ', card.title);
            for (const tag of card.tags) {
                console.log('un tag de la carte : ', tag.name);
            }
        }
    }


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
    const card3List= await Card.findByPk(3,{
        include:['list'],
       
    });
   
    console.log('Nom de la liste de la carte 3',card3List.list.name);



};

test();