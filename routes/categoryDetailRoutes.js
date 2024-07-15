const express = require('express');
const categoryDetail = require('../controllers/categoryDetail.js');

const router = express.Router();
//console.log("fjddjdjdv")

router.route('/')
.get(categoryDetail.getAllCategory);


module.exports = router;