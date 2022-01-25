
BEGIN;
/*On efface les tables */
DROP TABLE IF EXISTS "list", "tag", "card", "card_has_tag";
COMMIT;

BEGIN;
/*Création des tables */
CREATE TABLE "list" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT,
  "position" INTEGER NOT NULL
);

CREATE TABLE "card" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT,
  "position" INTEGER NOT NULL,
  "color" TEXT,
  "list_id" INTEGER REFERENCES "list"("id")
);

CREATE TABLE "tag" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "color" TEXT
);
CREATE TABLE "card_has_tag" (
  "tag_id" INTEGER REFERENCES "tag"("id"),
  "card_id" INTEGER REFERENCES "card"("id"),
  PRIMARY KEY ("tag_id", "card_id")
);

COMMIT;

/*On remplit de données fictives*/
BEGIN;
INSERT INTO "list" ("id", "name", "position") VALUES 
(1, 'En attente', 1),
(2, 'En cours', 2),
(3, 'A valider', 3),
(4, 'Terminé', 4);

INSERT INTO "card" ("id", "title", "position", "color", "list_id") VALUES 
(1, 'Models', 1,'#AAAAAA', 1),
(2, 'Database', 2, '#DDDDDD', 2),
(3, 'MLD', 3,'#AAAAAA', 3),
(4, 'MCD', 4, '#DDDDDD', 4);

INSERT INTO "tag" ("id", "name", "color") VALUES 
(1, 'def projet', '#AAAAAA'),
(2, 'back', '#DDDDDD');

INSERT INTO "card_has_tag" ("card_id", "tag_id") VALUES
(1,2),
(2,1),
(3,1),
(4,1);

COMMIT;

