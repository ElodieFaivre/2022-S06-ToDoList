const List = require('./list');
const Card = require('./card');
const Tag = require('./tag');

// Une carte est défini par plusieurs Tag
Card.belongsToMany(Tag, {
    as: 'tags',
    // a travers la table de liaison qui s'apelle...
    through: 'card_has_tag',
    // le nom de Card (la gauche de belongsToMany) dans la table de liaison
    foreignKey: 'card_id',
    // la clé de "l'autre" (ici Tag)
    otherKey: 'tag_id',
    // ici écrire timestamps false permettra d'ignorer le updated_at
    // dont nous n'avons pas besoin
    timestamps: false
});

// Un Tag définit plusieurs cartes Card
Tag.belongsToMany(Card, {
    as: 'cardList',
    // a travers la table de liason qui s'apelle...
    through: 'card_has_tag',
    // le nom de Card (la gauche de belongsToMany) dans la table de liaison
    foreignKey: 'tag_id',
    // la clé de "l'autre" (ici Tag)
    otherKey: 'card_id',
    // ici écrire timestamps false permettra d'ignorer le updated_at
    // dont nous n'avons pas besoin
    timestamps: false
});

// Une liste a plusieurs Card
List.hasMany(Card, {
    // le as sera la clé qui permettra d'accéder aux valeurs associés
    // dans une instance de notre modèle (ici List)
    // il faudra également l'écrire dans le include lors de nos find
    as: 'cards',
    // la clé étrangère dans le modele ciblé (ici Card)
    // qui permettra de trouver l'association
    foreignKey: 'list_id'
});

// Une Card appartient a une List
Card.belongsTo(List, {
    as: 'list',
    foreignKey: 'list_id'
});


module.exports = { Card, List, Tag };