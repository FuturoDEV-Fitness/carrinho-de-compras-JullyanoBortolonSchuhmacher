const express = require('express');
const router = express.Router();
const protudosController = require('../controller/ProductsController.js');

router.post('/', (req, res) => protudosController.create(req, res));
router.get('/', (req, res) => protudosController.list(req, res));
router.get('/:id', (req, res) => protudosController.listId(req, res));
router.delete('/:id', (req, res) => protudosController.delete(req, res));
router.patch('/:id', (req, res) => protudosController.update(req, res));

module.exports = router;