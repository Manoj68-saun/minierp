const express = require('express');
const itemWiseController = require('../controllers/itemWiseTaxController');

const router = express.Router();


router.route('/').get(itemWiseController.getAllTax)

router.route('/create-tax').post(itemWiseController.createTax);

router.route('/additional-data').get(itemWiseController.getAdditionalData);


router
  .route('/:code')
  .get(itemWiseController.getTaxData)
  .patch(itemWiseController.updateTax)
  .delete(itemWiseController.deleteTax);

module.exports = router;
