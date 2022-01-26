// on va charger nos variables d'environnement
require('dotenv').config();

// ici on require app/models
// comme c'est un dossier, cela revient a
// require app/models/index
const { Tag, Card, List } = require('./app/models');


async function test() {
    // essayons de récupérer les listes

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

    for (const list of listArray) {
        for (const card of list.cards) {
            console.log('jai une carrte : ', card.content);

            for (const tag of card.tags) {
                console.log('un tag de la carte : ', tag.name);
            }
        }
    }
    
}

test();


