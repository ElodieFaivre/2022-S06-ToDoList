
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