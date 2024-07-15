const express = require('express');
const cnsController = require('../controllers/cnsController');

const router = express.Router();

router.route('/').get(cnsController.getCNS);

module.exports = router;
