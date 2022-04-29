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