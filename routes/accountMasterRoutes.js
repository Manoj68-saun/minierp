const express = require('express');
const accMasterController = require('../controllers/accMasterController');

const router = express.Router();


router.route('/').get(accMasterController.getAllAcc)

router.route('/create-account').post(accMasterController.createAccount);

router.route('/additional-data').get(accMasterController.getAdditionalData);


router
  .route('/:code')
  .get(accMasterController.getAccData)
  .patch(accMasterController.updateAccount)
  .delete(accMasterController.deleteAccount);

module.exports = router;
