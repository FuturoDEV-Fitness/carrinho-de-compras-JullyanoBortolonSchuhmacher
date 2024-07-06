const express = require('express');
const router = express.Router();
const orderController = require('../controller/OrderController');

router.post('/', (req, res) => orderController.create(req, res));
router.get('/', (req, res) => orderController.list(req, res));
router.get('/:id', (req, res) => orderController.listId(req, res));
router.delete('/:id', (req, res) => orderController.delete(req, res));
router.patch('/:id', (req, res) => orderController.update(req, res));

module.exports = router;
