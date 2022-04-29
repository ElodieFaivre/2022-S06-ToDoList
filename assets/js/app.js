const listModule = require('./listModule');
const cardModule = require('./cardModule');
const tagModule = require('./tagModule');
const utils = require('./utils');

// on objet qui contient des fonctions
const app = {
 
  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    app.addListenerToActions();
    app.getListsFromAPI();
    app.getTagsFromAPI();
    //app.sortCards();
  },

  getListsFromAPI: async function () {
    try {
      const response = await fetch(`${utils.base_url}/lists`);
      const lists = await response.json();
      console.log('listes recuperer dans getListsFromAPI', lists)

      for (const list of lists) {
        console.log('list qui bug dans le for', list)
        listModule.makeListInDOM(list);
        for (const card of list.cards) {
          cardModule.makeCardInDOM(card);
          for (const tag of card.tags) {
            tagModule.makeTagInDOM(tag);
          }
        }
      }
    }
    catch (err) {
      console.error(err);
      alert("erreur recuperation listes");
    }
  },

  getTagsFromAPI: async function () {
    try {
      const response = await fetch(`${utils.base_url}/tags`, { method: 'GET' });
      const tags = await response.json();

      console.log("TAGS", tags);
      const addCardForm = document.querySelector('#addCardModal form');
      const addTagForm = document.querySelector('#addTagModal form');
      //Ajout des choix des tags dans la modale addCard

      for (const tag of tags) {

        //ICI POUR L'JOUT DANS LA MODALE CARD
        const newTag = document.createElement('input');
        newTag.setAttribute("type", "checkbox");
        newTag.setAttribute("name", `tags[${tag.id}]`);
        newTag.setAttribute("value", tag.id);
        newTag.setAttribute("id", tag.id);

        const newTagLabel = document.createElement('label');
        newTagLabel.setAttribute("for", tag.id);
        newTagLabel.classList.add("tag");
        newTagLabel.textContent = tag.name;
        newTagLabel.style.backgroundColor = tag.color;

        //Ajout dans le formulaire de l'ajout de carte
        addCardForm.querySelector(".tags-form").appendChild(newTag);
        addCardForm.querySelector(".tags-form").appendChild(newTagLabel);


        //IDEM POUR L'AJOUT DANS LA MODALE TAG
        const newTag2 = document.createElement('input');
        newTag2.setAttribute("type", "checkbox");
        newTag2.setAttribute("name", `tags[${tag.id}]`);
        newTag2.setAttribute("value", tag.id);
        newTag2.setAttribute("id", tag.id);

        const newTagLabel2 = document.createElement('label');
        newTagLabel2.setAttribute("for", tag.id);
        newTagLabel2.classList.add("tag");
        newTagLabel2.textContent = tag.name;
        newTagLabel2.style.backgroundColor = tag.color;
        //Ajout aussi dans le formulaire de la modale ajout de tag
        addTagForm.querySelector(".tags-list-form").appendChild(newTag2);
        addTagForm.querySelector(".tags-list-form").appendChild(newTagLabel2);
      }
    }
    catch (err) {
      console.error(err);
      alert("erreur recuperation tags");
    }
  },

  addListenerToActions: function () {
    //Action sur bouton ajout de la liste
    const addListButton = document.getElementById('addListButton');
    addListButton.addEventListener('click', listModule.showAddListModal);

    //Action sur bouton fermer la modale
    const closeButtons = document.querySelectorAll('.close');
    for (const closeButton of closeButtons) {
      closeButton.addEventListener('click', utils.hideModals);
    }

    //Action sur valider le formulaire d'ajout de liste
    const addListForm = document.querySelector('#addListModal form')
    addListForm.addEventListener('submit', listModule.handleAddListForm);

    //Action sur valider le formulaire d'ajout de carte
    const addCardForm = document.querySelector('#addCardModal form')
    addCardForm.addEventListener('submit', cardModule.handleAddCardForm);

    //Action sur valider le formulaire d'ajout de tag
    const addTagForm = document.querySelector('#addTagModal form')
    addTagForm.addEventListener('submit', tagModule.handleAddTagToCardForm);

    //Ajout de la possiilité de bouger les listes
    listPanel = document.querySelector('#listPanel')
    Sortable.create(listPanel, {
      draggable: '.panel',
      onEnd: listModule.moveLists
    });
  },
};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);