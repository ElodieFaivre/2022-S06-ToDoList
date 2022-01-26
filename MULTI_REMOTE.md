# s6

La s6 c'est cool on pratique tous les jours sur un projet fil rouge

En plus on corrige chaque jour ce qu'on a fait la veille avant d'avancer

Par contre entre les corrections du profs et nos mises à jours quotidienne ça va etre le gros bordel dans nos fichiers.

A moins qu'on s'organise un peu avec git

Ce qu'on va faire :

- On va garder master pour la version clean, cad la correction
- Au quotidien on va préférer travailler dans des branches, par exemple pourquoi pas faire une branche par jour
- On va se brancher à la remote du prof via `git remote add correction git@github.com:O-clock-Zagreus/S06E01-oKanban-API-alexisOclock.git`

Rappel pratique :

- pour changer de branche : `git checkout nomdelabranche`
- pour créer une branche à partir de la branche sur laquelle on se trouve :
  - On vérifie qu'on est à jour dans nos commits (git status)
  - On crée la branche et on se positionne dessus avec `git checkout -b nomdelanouvellebranche`
  - Si on veut récupérer les derniers commit de correction sur la branche master :
    - On se met sur master `git checkout master`
    - On pull depuis la bonne remote `git pull correction master` avec l'option pour l'historique au besoin `git pull --allow-unrelated-histories correction master`

Astuce si on a travaillé sur master :

- On se place sur master `git checkout master`
- On commit tout ce qui doit l'etre
- On crée une nouvelle branche pour ne rien perdre `git checkout -b jour1`
- On revient sur master `git checkout master`
- On pull `git pull --allow-unrelated-histories correction master`
- On résoud les conflits au besoin en ouvrant les fichiers dans VSCode, on accèpte les modifications entrantes
- On add et commit nos changements
- On crée notre nouvelle branche pour la journée à venir `git checkout -b jour2`

Pour pull en résolvant les conflit automatiquement sans se casser la tete

- On se met sur master puis `git pull --no-edit -X theirs correction master`

## Le multiremote

Un dépot git local peut etre branché/relié à un dépot distant via la commente `git remote add` ainsi on peut lire le dépot distant via `git pull` et ou écrire sur le dépot distant via `git push`

On appelle souvent la remote par défaut `origin` mais on peut en ajouter plusieurs avec des nom différents

`git remote add NOMDELAREMOTE ADRESSEDUDEPOTDISTANT`

Si on veut pull depuis une remote spécifique on doit préciser son nom

- `git pull` -> récupère depuis la remote par défaut `origin`
- `git pull NOMDELAREMOTE NOMDELABRANCHE` par exemple `git pull correction master` récupère les commit de la branche master de la remote correction sur la branche actuel
- On peut rencontrer 2 erreurs : 
  - Si on a des conflits parce qu'on commité sur master plutot que de travailler sur des branches 
    - on résoud les conflit et on commit
  - Si on a l'erreur "refusing to merge unrelated histories" (on l'aura certainement la première fois) c'est normal puisqu'on on essaye de combiner du contenu de 2 dépots différents, on doit dire à git explicitement qu'on autorise bien le pull ici `git pull --allow-unrelated-histories correction master`
