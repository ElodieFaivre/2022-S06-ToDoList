(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"./cardModule":2,"./listModule":3,"./tagModule":4,"./utils":5}],2:[function(require,module,exports){
const tagModule = require('./tagModule');
const utils = require('./utils');

const cardModule = {
    showAddCardModal: function (event) {
        const list_id = event.target.closest('.panel').getAttribute('data-list-id');

        const modal = document.getElementById('addCardModal');

        //ou alors si pas de class :   document.querySelector('.addCardModal input[name="list_id"]')
        const listById = modal.querySelector('.input-list_id');
        listById.value = list_id;
        modal.classList.add("is-active");
    },

    handleAddCardForm: async function (event) {
        try {
            event.preventDefault();

            const formData = new FormData(event.target);

            //j'envoie les données du formualire à la BDD en passant par la route POST
            const response = await fetch(`${utils.base_url}/cards`, { method: 'POST', body: formData });

            if (response.status == '201') {
                const data = await response.json();

                //J'efface les données du formulaire
                event.target.querySelector('input[name="content"]').value = "";
                event.target.querySelector('input[name="color"]').value = "#D9C3C3";

                //Association des tags
                //- je recupère la carte
                const cardId = data.id;
                //- je récupère les tags
                const tagsId = [];
                for (let i = 0; i < 50; i++) {
                    if (formData.get(`tags[${i}]`)) {
                        tagsId.push(formData.get(`tags[${i}]`));
                    }
                }

                console.log('cardId', cardId);
                console.log('tagsId', tagsId);
                cardModule.makeCardInDOM(data);
                if (tagsId) {
                    for (const tagId of tagsId) {

                        const formDataTag = new FormData();
                        formDataTag.append("id", tagId)

                        //J'associe les tags
                        const responseTag = await fetch(`${utils.base_url}/cards/${cardId}/tags`, { method: 'POST', body: formDataTag })
                        const cardWithTag = await responseTag.json();

                        const tag = cardWithTag.tags.find((tag) => tag.id == tagId);
                        console.log(tag);
                        // insérer le tag dans la bonne carte
                        tagModule.makeTagInDOM(tag);
                    }
                }
                utils.hideModals();
            }
            else {
                alert('erreur lors de lajout dune carte');
            }

        }
        catch (err) {
            console.error(err)
            alert('erreur lors ajout dune carte');
        }
    },

    handleEditCardForm: async function (event) {
        try {
            event.preventDefault();

            const formData = new FormData(event.target);
            const cardID = formData.get('card-id');
            if (!formData.get('content')) {
                return alert('le nom ne peut pas être vide')
            }

            const title = event.target.closest('.columns').querySelector('.card-title');

            const buttons = event.target.closest('.columns').querySelector('.is-narrow');

            const response = await fetch(`${utils.base_url}/cards/${cardID}`, { method: 'PATCH', body: formData });

            if (response.status == '200') {
                const data = await response.json();

                console.log(data);

                title.textContent = data.content;
                event.target.closest('.box').style.backgroundColor = data.color;
            }
            else {

                alert('erreur sur le fetch patch update carte');
            }
            event.target.classList.toggle('is-hidden');
            title.classList.toggle('is-hidden');
            buttons.classList.toggle('is-hidden');

        }
        catch (err) {
            console.error(err)
            alert('erreur lors modif dune carte');
        }
    },

    handleDeleteCard: async function (event) {
        try {
            const isConfirm = confirm("Etes vous sûr de vouloir supprimer la carte ?")
            if (isConfirm) {
                const cardID = event.target.closest(".box").dataset.cardId;
                console.log(cardID);

                const response = await fetch(`${utils.base_url}/cards/${cardID}`, { method: 'DELETE' });

                console.log(response.status);
                if (!response.status == '204') {
                    alert('erreur sur le fetch delete de la carte');
                }
                else {
                    event.target.closest(".box").remove();
                }
            }
        }
        catch (err) {
            console.error(err);
            alert('erreur lors de la suppression de la carte');
        }
    },

    makeCardInDOM: function (card) {
        const templateCard = document.getElementById('newCardTemplate');
        const templateCardContent = templateCard.content;
    
        console.log('cardListID,',card.list_id)
        //on recupère l'endoit où l'inserstion doit avoir lieu
        const list = document.querySelector(`.panel[data-list-id="${card.list_id}"]`);
        console.log('list qui bug recuperée du DOM', list)
        const cardContainer = list.querySelector('.panel-block');
    
        //On clone le template
        const cloneCard = templateCardContent.cloneNode(true);
    
        //On change le data-card-id de la carte 
        const divToModify = cloneCard.querySelector('.box')
        divToModify.dataset.cardId = card.id;
        if (!card.color == "") {
          divToModify.style.backgroundColor = card.color;
        }
    
        // On change le titre
        cloneCard.querySelector('.card-title').textContent = card.content;
    
       //On ajoute l'écouteur d'evenement sur le stylo
        cloneCard.querySelector('.has-text-primary').addEventListener('click', cardModule.showFormToEditCard);
        //On ajoute l'écouteur d'evenement sur la poubelle
        cloneCard.querySelector('.has-text-danger').addEventListener('click', cardModule.handleDeleteCard);
    
        //Action sur valider le formulaire d'édition de la carte
        const form = cloneCard.querySelector('form');
        form.querySelector("input[name=card-id]").value = card.id;
        form.querySelector("input[name=content]").value = card.content;
        if (!card.color == "") {
          form.querySelector("input[name=color]").value = card.color;
        }
        form.addEventListener('submit', cardModule.handleEditCardForm);
    
        //Ajout de l'écouteur d'evenement sur le fermer du formulaire
        form.querySelector('.close').addEventListener('click', cardModule.closeEditCardForm);
    
        //Ajout de l'écouteur d'évenement sur l'ajout de tag
        cloneCard.querySelector(".add-tag").addEventListener('click', tagModule.showAddTagModal);
        //On l'injecte dans la page
        cardContainer.appendChild(cloneCard);
      },

      showFormToEditCard: function (event) {
        //L'event est ici le  clic sur l'icone stylo
        const parent_div = event.target.closest('.columns');
        const titleToHide = parent_div.querySelector('.card-title');
        const buttonsToHide = parent_div.querySelector('.is-narrow');
        //le form est mis dans un div parent (css)
        const form = parent_div.querySelector('form');
    
        titleToHide.classList.toggle('is-hidden');
        buttonsToHide.classList.toggle('is-hidden');
        form.classList.remove('is-hidden');
      },

      closeEditCardForm: function (event) {
        event.target.closest('form').classList.add('is-hidden');
        event.target.closest('.columns').querySelector('.card-title').classList.remove('is-hidden');
        event.target.closest('.columns').querySelector('.is-narrow').classList.remove('is-hidden');
      },

      moveCards: async function (cards) {
        cards.forEach(async (card, index) => {
          const id = card.dataset.cardId;
          const listId = card.closest('.panel').dataset.listId;
          const formData = new FormData;
          formData.append('position', index);
          formData.append('list_id', listId);
    
          try {
            await fetch(`${utils.base_url}/cards/${id}`, {
              method: 'PATCH', body: formData
            });
          }
          catch (err) {
            console.error(err);
            alert('erreur deplacement carte')
          }
    
        });
      },

      onCardDrop: async function (event) {
        //liste d'origine
        const oldList = event.from;
        //Nvelle liste
        const newList = event.to;
    
        //Toutes les cartes de la liste d'origine
        let cards = oldList.querySelectorAll('.box');
        await cardModule.moveCards(cards);
    
        cards = newList.querySelectorAll('.box');
        await cardModule.moveCards(cards);   
      },
}

module.exports=cardModule;

},{"./tagModule":4,"./utils":5}],3:[function(require,module,exports){

const cardModule = require('./cardModule');
const utils = require('./utils');

const listModule = {
    showAddListModal: function () {
        const modal = document.getElementById('addListModal');
        modal.classList.add("is-active");
    },

    handleAddListForm: async function (event) {
        try {
            event.preventDefault();
            const formData = new FormData(event.target);

            // empêcher d'insérer une liste vide
            if (!formData.get('name')) return alert('Le nom de la liste ne doit pas être vide !');
            //j'envoie les données du formualire à la BDD en passant par la route POST
            const response = await fetch(`${utils.base_url}/lists`, { method: 'POST', body: formData });

            if (response.status == '201') {
                const data = await response.json();

                listModule.makeListInDOM(data);
                utils.hideModals();

            }
            else {
                alert('erreur sur le fetch post create liste');
            }
        }
        catch (err) {
            console.error(err);
            alert('erreur lors ajout dune liste');
        }
    },

    handleEditListForm: async function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const listID = formData.get('list-id');
        if (!formData.get('name')) return alert('Le nom de la liste ne peut pas être vide');
        console.log(listID);

        const h2 = event.target.closest('.column').querySelector('h2');
        try {
            const response = await fetch(`${utils.base_url}/lists/${listID}`, { method: 'PATCH', body: formData });

            if (response.status == '200') {
                const data = await response.json();

                console.log(data);

                h2.textContent = data.name;

            }
            else {

                alert('erreur sur le fetch patch update liste');
            }
            event.target.classList.add('is-hidden');
            h2.classList.remove('is-hidden');

        }
        catch (err) {
            console.error(err);
            alert('erreur lors modif dune liste');
        }
    },

    handleDeleteList: async function (event) {
        try {
            const isConfirm = confirm("Etes vous sûr de vouloir supprimer la liste et toutes ses cartes ?")
            if (isConfirm) {
                const listID = event.target.closest("*[data-list-id]").dataset.listId;
                console.log(listID);

                const response = await fetch(`${utils.base_url}/lists/${listID}`, { method: 'DELETE' });

                console.log(response.status);
                if (!response.status == '204') {
                    alert('erreur sur le fetch delete de la liste');
                }
                else {
                    event.target.closest("*[data-list-id]").remove();
                }
            }
            else {
                return;
            }
        }
        catch (err) {
            console.error(err);
            alert('erreur lors de la suppression de la liste');
        }
    },

    makeListInDOM: function (list) {
        const templateList = document.getElementById('newListTemplate');
        const templateListContent = templateList.content;

        const cardLists = document.querySelector('.card-lists');

        const cloneList = templateListContent.cloneNode(true);

        cloneList.querySelector('h2').textContent = list.name;

        //On change le data-list-id de la liste 
        const divToModify = cloneList.querySelector('.panel')
        divToModify.dataset.listId = list.id;


        //Ajout de l'écouteur d'evenement sur le bouton ajout d'une carte
        const addCardButton = cloneList.querySelector('.addCardButton');
        addCardButton.addEventListener('click', cardModule.showAddCardModal);

        //Ajout de l'écouteur d'evenement sur le delete liste
        cloneList.querySelector('.list-delete-btn').addEventListener('click', listModule.handleDeleteList);

        //Ajout de l'écouteur d'evenement sur le titre
        const title = cloneList.querySelector('h2');
        title.addEventListener('dblclick', listModule.showFormToEditList);

        //Action sur valider le formulaire d'édition de la liste
        const form = cloneList.querySelector('form');
        form.querySelector("input[name=list-id]").value = list.id;
        form.querySelector("input[name=name]").value = list.name;
        form.addEventListener('submit', listModule.handleEditListForm);

        //Ajout de l'écouteur d'evenement sur le fermer du formulaire
        form.querySelector('.close').addEventListener('click', listModule.closeEditListForm);

        //Ajout de la possibilité de bouger les cartes
        const listToSort = cloneList.querySelector(".cardPanel");
        listToSort.id = `cardPanel${list.id}`;

        Sortable.create(listToSort, {
            group: 'shared',
            //l'element déplacable
            darggable: '.box',
            onEnd: cardModule.onCardDrop

        }
        );
        cardLists.appendChild(cloneList);
    },

    showFormToEditList: function (event) {
        //Action : double clique sur le titre, on masque h2 et on affiche le form
        const parent_div = event.target.closest('.column');
        const h2 = parent_div.querySelector('h2');
        const form = parent_div.querySelector('form');

        h2.classList.toggle('is-hidden');
        form.classList.toggle('is-hidden');
    },

    closeEditListForm: function (event) {
        event.target.closest('form').classList.add('is-hidden');
        event.target.closest('.column').querySelector('h2').classList.remove('is-hidden');
    },

    moveLists: async function (event) {
        let lists = document.querySelectorAll(".panel[data-list-id]");

        lists.forEach(async (list, index) => {
            const id = list.dataset.listId;
            const formData = new FormData;
            formData.append('position', index);
            try {

                await fetch(`${utils.base_url}/lists/${id}`, {
                    method: 'PATCH', body: formData
                });
            }
            catch (err) {
                console.error(err);
                alert('erreur deplacement lists')
            }

        });
    },
}

module.exports=listModule;
},{"./cardModule":2,"./utils":5}],4:[function(require,module,exports){

const utils = require('./utils');

const tagModule = {
    showAddTagModal: function (event) {
        const card_id = event.target.closest('.box').getAttribute('data-card-id');
        //console.log(card_id);
        const modal = document.getElementById('addTagModal');

        //ou alors si pas de class :   document.querySelector('.addCardModal input[name="list_id"]')
        const cardId = modal.querySelector('.input-card_id');
        cardId.value = card_id;
        modal.classList.add("is-active");
    },

    handleAddTagToCardForm: async function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        //Association des tags
        //- je recupère la carte
        const cardId = formData.get('card_id')
        //- je récupère les tags
        const tagsId = [];
        for (let i = 0; i < 50; i++) {
            if (formData.get(`tags[${i}]`)) {
                tagsId.push(formData.get(`tags[${i}]`));
            }
        }
        try {
            if (tagsId) {
                for (const tagId of tagsId) {

                    const formDataTag = new FormData();
                    formDataTag.append("id", tagId)

                    //J'associe les tags
                    const responseTag = await fetch(`${utils.base_url}/cards/${cardId}/tags`, { method: 'POST', body: formDataTag })

                    const cardWithTag = await responseTag.json();
                    const tag = cardWithTag.tags.find((tag) => tag.id == tagId);
                    console.log('tag trouvé', tag);
                    // insérer le tag dans la bonne carte
                    tagModule.makeTagInDOM(tag);
                }
            }
            utils.hideModals();
        }
        catch (err) {
            console.error(err)
            alert('erreur lors ajout tag à une carte');
        }
    },

    makeTagInDOM: function (tag) {
        // const existingTag= document.querySelector(`.box[data-card-id="${tag.card_has_tag.card_id}"] .tags`).querySelectorAll(".tag");
        // for(const tagDOM of existingTag){
        //   tagDOM.innerHTML="";
        // };
        const a = document.createElement("a");
        a.classList.add("tag");
        a.classList.add("is-small");
        a.dataset.tagId = tag.id;

        a.textContent = tag.name;
        a.style.backgroundColor = tag.color;


        document.querySelector(`.box[data-card-id="${tag.card_has_tag.card_id}"] .tags`).appendChild(a);

        //Ajout de l'icone de suppression
        const span = document.createElement("span");
        span.classList.add("icon", "is-small");
        span.style.marginLeft = "0.5rem";
        a.appendChild(span);

        const i = document.createElement("i");
        i.classList.add("fas", "fa-trash-alt");

        span.appendChild(i);

        //ajout de l'écouteur d'evenement sur la poubelle
        span.addEventListener('click', tagModule.removeTagOnCard);
    },

    removeTagOnCard: async function (event) {

        const cardId = event.target.closest(".box[data-card-id]").dataset.cardId;
        const tagDOM = event.target.closest("*[data-tag-id]");
        const tagId = tagDOM.dataset.tagId;

        try {
            const response = await fetch(`${utils.base_url}/cards/${cardId}/tags/${tagId}`, { method: 'DELETE' });
            tagDOM.remove();
        }
        catch (err) {
            console.error(err);
            alert('Erreur lors de la suppression du tag');
        }
    },
}

module.exports=tagModule;
},{"./utils":5}],5:[function(require,module,exports){
const utils = {
 //URL de l'API faite en S06
 base_url: 'http://localhost:5050',

 hideModals: function () {
    const modals = document.querySelectorAll('.modal');
    //console.log(modals);
    for (const modal of modals) {
      modal.classList.remove("is-active");
    }
  },
}

module.exports=utils;
},{}]},{},[1]);
