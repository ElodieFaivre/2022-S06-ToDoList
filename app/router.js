const express = require('express');

const listController = require('./controllers/listController');

const router = express.Router();

router.get('/lists', listController.getAllLists);
router.post('/lists', listController.createList);


module.exports = router;