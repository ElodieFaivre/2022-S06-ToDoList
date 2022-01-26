-- On démarre une transaction afin de s'assurer de la cohérence globale de la BDD
BEGIN;

-- On supprime les tables si elles existent
DROP TABLE IF EXISTS "list", "card", "tag", "card_has_tag";

-- la table list
CREATE TABLE "list" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 0,
    -- pour avoir la date et l'heure on utilise le type "timestamp", et pour Ãªtre le plus prÃ©cis possible on utilisera plutÃ´t le type "timestampz" qui contient en plus de la date et de l'heure le fuseau horaire dÃ©fini dans les locales du serveur
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

-- la table card
CREATE TABLE "card" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "title" TEXT NOT NULL DEFAULT '',
  "color" TEXT NOT NULL DEFAULT '#FFF' ,
  -- si l'on veut pouvoir supprimer une liste qui contient des cartes, on est obligé de rajouter "ON DELETE CASCADE" qui aura pour conséquence de supprimer toutes les cartes qui font référence à la liste
  "list_id" INTEGER NOT NULL REFERENCES list("id") ON DELETE CASCADE,
  "position" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);


-- la table tag
CREATE TABLE "tag" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL DEFAULT '',
  "color" TEXT NOT NULL DEFAULT '#FFF' ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ
);

-- on oublie pas la table d'association
CREATE TABLE "card_has_tag" (
  -- si l'on veut pouvoir supprimer une carte ou un tag, on est obligé de rajouter "ON DELETE CASCADE" qui aura pour conséquence de supprimer les associations qui font référence a la carte ou le tag supprimé.
  "card_id" INTEGER NOT NULL REFERENCES card("id") ON DELETE CASCADE,
  "tag_id" INTEGER NOT NULL REFERENCES tag("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 "updated_at" TIMESTAMPTZ,
  -- ici pas forcément obligatoire  d'updated_at car une relation ne se met pas à jour, soit on l'ajoute soit on la supprime
  UNIQUE ("card_id", "tag_id")
);


COMMIT;


/*On remplit de données fictives*/
BEGIN;
INSERT INTO "list" ("name") VALUES 
('En attente'),
('En cours'),
('A valider'),
('Terminé');

INSERT INTO "card" ("title", "color", "list_id") VALUES 
('Models', '#AAAAAA', 1),
('Database', '#DDDDDD', 2),
('MLD', '#AAAAAA', 3),
('MCD', '#DDDDDD', 4);

INSERT INTO "tag" ("name", "color") VALUES 
('def projet', '#AAAAAA'),
('back', '#DDDDDD');

INSERT INTO "card_has_tag" ("card_id", "tag_id") VALUES
(1,2),
(2,1),
(3,1),
(4,1);

COMMIT;

