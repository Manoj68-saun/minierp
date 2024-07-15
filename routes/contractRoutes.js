const express = require('express');
const salesContractController = require('../controllers/salesContractController');

const router = express.Router();


router.route('/').get(salesContractController.getAllSauda)

router.route('/create-sales-contract').post(salesContractController.createSauda);

router.route('/additional-data').get(salesContractController.getAdditionalData);
router.route('/get-pending-saudas/').get(salesContractController.getAllContract);

router
  .route('/:code')
  .get(salesContractController.getSaudaData)
  .patch(salesContractController.updateSauda)
  .delete(salesContractController.deleteSauda);

module.exports = router;
