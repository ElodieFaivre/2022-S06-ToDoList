## MLD

LIST (listCode, name, position)
CARD (cardCode, title, position, color, #listCode)
TAG (tagCode, name, color)
CARD_HAS_TAG(#cardCode, #tagCode)

## TABLES avec les types

- TABLE list:
  id SERIAL PRIMARY KEY,
  name TEXT,
  position INTEGER,


- TABLE card:
  id SERIAL PRIMARY KEY,
  title TEXT,
  position INTEGER,
  color TEXT,
  list_id INTEGER,


- TABLE tag :
  id SERIAL PRIMARY KEY,
  name TEXT,
  color TEXT,

- TABLE card_has_tag :
  tag_id INTEGER,
  card_id INTEGER 

