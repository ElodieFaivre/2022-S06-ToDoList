const express = require('express');

const listController = require('./controllers/listController');
const cardController = require('./controllers/cardController');
const tagController = require('./controllers/tagController');
const mainController = require('./controllers/mainController');

const router = express.Router();

router.get('/lists', listController.getAllLists);
router.post('/lists', listController.createList);

router.get('/lists/:id', listController.getOneList);
router.patch('/lists/:id', listController.updateList);
router.delete('/lists/:id', listController.deleteList);

router.get('/lists/:id/cards', cardController.getAllCardsInList);
router.post('/cards', cardController.createCard);
router.get('/cards/:id', cardController.getOneCard);
router.patch('/cards/:id', cardController.updateCard);
router.put('/cards/:id?', cardController.createOrUpdate);
router.delete('/cards/:id', cardController.deleteCard);

router.get('/tags', tagController.getAllTags);
router.post('/tags', tagController.createTag);

router.get('/tags/:id', tagController.getOneTag);
router.patch('/tags/:id', tagController.updateTag);
router.delete('/tags/:id', tagController.deleteTag);

router.post('/cards/:id/tags', mainController.linkTagToCard);
router.delete('/cards/:cardId/tags/:tagId', mainController.removeTagToCard)


module.exports = router;