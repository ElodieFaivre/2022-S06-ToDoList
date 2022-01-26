# Les routes de notre API

| URL        | GET                                 | POST                                                              | PATCH                                                                         | DELETE                                                                    |
|------------|-------------------------------------|-------------------------------------------------------------------|-------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| /lists     | récupérer toutes les listes         | créer une liste                                                   | ne pas faire (ca voudrait dire mettre a jour toutes les listes en même temps) | ne pas faire (ca voudrait dire supprimer toutes les listes en même temps) |
| /lists/:id | récupère une seule liste via son ID | ne pas faire (ca voudrait dire créer une liste en donnant son id) | mettre a jour une liste                                                       | supprimer une liste                                                       |
| /cards     | récupérer toutes les cartes         | créer une carte                                                   | ne pas faire (meme raison qu'au dessus)                                       | ne pas faire                                                              |
| /cards/:id | récupérer UNE carte via son ID      | ne pas faire                                                      | mettre a jour une carte                                                       | supprimer une carte                                                       |
| /tags      | récupérer tous les labels           | créer un label                                                    | ne pas faire                                                                  | ne pas faire                                                              |
| /tags/:id  | récupérer UN label via son ID       | ne pas faire                                                      | mettre a jour un label                                                        | supprimer un label                                                        |

Toutes les routes au dessus sont dites **RESTful**. C'est a dire qu'elles respectent la convention REST.

Avec ce systeme, on peut changer la liste d'une carte :

- on fera une requête PATCH sur /cards/:id
- et dans le body, on donnera un nouveau list_id
- et tout ira bien.

Sauf que... comment on va se débrouiller pour les tags ?

## Les routes spéciales pour l'association card-tag

Dans ce cas spécifique, les routes qui vont nous permettre de gérer l'association entre card et tag ne pourront pas être RESTful. C'est a dire que ces routes vont manipuler DEUX resources a la fois, par opposition aux routes du dessus, qui concernent toutes une seule resource.

| URL                        | VERBE  | L'url contiendra                            | Le body contiendra     | Description                   |
|----------------------------|--------|---------------------------------------------|------------------------|-------------------------------|
| /cards/:id/tags            | POST   | l'id de la carte a associer                 | l'id du tag a associer | Associer un tag a une carte   |
| /cards/:cardId/tags/:tagId | DELETE | l'id de la carte et l'id du tag a dissocier | RIEN                   | Dissocier un tag et une carte |