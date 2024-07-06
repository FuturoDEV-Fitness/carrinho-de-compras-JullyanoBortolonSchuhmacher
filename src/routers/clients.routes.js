const express = require('express');
const router = express.Router();
const clienteController = require('../controller/ClientController.js');

router.post('/', (req, res) => clienteController.create(req, res));
router.get('/', (req, res) => clienteController.list(req, res));
router.get('/:id', (req, res) => clienteController.listId(req, res));
router.delete('/:id', (req, res) => clienteController.delete(req, res));
router.patch('/:id', (req, res) => clienteController.update(req, res));

module.exports = router;