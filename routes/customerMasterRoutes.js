const express = require('express');
const customerMasterController = require('../controllers/customerMasterController');

const router = express.Router();



router.route('/').get(customerMasterController.getAllCustomer).post(customerMasterController.createCustomer);
router.route('/acc-group').get(customerMasterController.getAccGroup);
router.route('/additional-data').get(customerMasterController.getAdditionalData);

router
  .route('/:code')
  .get(customerMasterController.getCustomer)
  .patch(customerMasterController.updateCustomer)
  .delete(customerMasterController.deleteCustomer);

module.exports = router;

