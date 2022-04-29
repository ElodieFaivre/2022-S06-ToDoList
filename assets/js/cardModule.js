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
