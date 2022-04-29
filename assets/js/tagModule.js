
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