const List = require("./list");
const Card = require("./card");
const Tag = require("./tag");

Card.belongsTo(List,{
    foreignKey:"list_id",
    as:"list"
});

List.hasMany(Card,{
    foreignKey:"list_id",
    as:"cards"
});

Card.belongsToMany(Tag,{
    as:"tags",
    through:'card_has_tag',
    foreignKey:'card_id',
    otherKey:'tag_id',
});

Tag.belongsToMany(Card,{
    as:"cards",
    through:'card_has_tag',
    foreignKey:'tag_id',
    otherKey:'card_id',
});

module.exports = {List, Card, Tag};