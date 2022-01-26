## MLD

LIST (listCode, name, position)
CARD (cardCode, title, position, color, #listCode)
TAG (tagCode, name, color)
CARD_HAS_TAG(#cardCode, #tagCode)



## TABLES avec les types

### Table List
| Nom        | Type        | Null ? | Default               | Commentaires       |
|------------|-------------|--------|-----------------------|--------------------|
| id         | INTEGER     | non    | GENERATED AS IDENTITY | clé primaire       |
| name       | TEXT        | non    | non                   |                    |
| position   | INTEGER     | non    | 0                     |                    |
| created_at | TIMESTAMPTZ | non    | NOW()                 |                    |
| updated_at | TIMESTAMPTZ | oui    | non                   | géré par sequelize |

### La table Card

| Nom        | Type        | Null ? | Default               | Commentaires                           |
|------------|-------------|--------|-----------------------|----------------------------------------|
| id         | INTEGER     | non    | GENERATED AS IDENTITY | clé primaire                           |
| content    | TEXT        | non    | ''                    | le contenu de la carte, son texte quoi |
| color      | TEXT        | non    | '#FFF'                |                                        |
| position   | INTEGER     | non    | 0                     |                                        |
| list_id    | INTEGER     | non    |                       | Clé étrangère vers la table list       |
| created_at | TIMESTAMPTZ | non    | NOW()                 |                                        |
| updated_at | TIMESTAMPTZ | oui    | non                   | géré par sequelize                     |

### La table Tag

| Nom        | Type        | Null ? | Default               | Commentaires       |
|------------|-------------|--------|-----------------------|--------------------|
| id         | INTEGER     | non    | GENERATED AS IDENTITY | clé primaire       |
| name       | TEXT        | non    | ''                    | le nom du tag      |
| color      | TEXT        | non    | '#FFF'                |                    |
| created_at | TIMESTAMPTZ | non    | NOW()                 |                    |
| updated_at | TIMESTAMPTZ | oui    | non                   | géré par sequelize |

### La table d'association entre Card et Tag : card_has_tag

| Nom        | Type        | Null ? | Default               | Commentaires            |
|------------|-------------|--------|-----------------------|-------------------------|
| card_id    | INTEGER     | non    | GENERATED AS IDENTITY | clé étrangère vers card |
| tag_id     | TEXT        | non    | GENERATED AS IDENTITY | clé étrangère vers tag  |
| created_at | TIMESTAMPTZ | non    | NOW()                 |                         |
| updated_at | TIMESTAMPTZ | oui    | non                   | géré par sequelize      |