const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.get('/clients', clientController.getAllclients);
router.get('/clients/:id', clientController.getclientById);
router.post('/clients', clientController.createclient);
router.put('/clients/:id', clientController.updateclient);
router.delete('/clients/:id', clientController.deleteclient);

module.exports = router;
