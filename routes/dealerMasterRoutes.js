const express=require('express');
const dealerMasterController = require('../controllers/dealerMasterController');

const router = express.Router();

router.route('/dealer-data').get(dealerMasterController.getdealerData)
// router.route('/attendance-data').get(itemMasterController.getAttendanceData)

router.route('/').get(dealerMasterController.getAlldealers).post(dealerMasterController.createdealer);

router.route('/additional-data').get(dealerMasterController.getAdditionalData);

router
  .route('/:code')
  .get(dealerMasterController.getdealerData)
  .patch(dealerMasterController.updateDealer)
  .delete(dealerMasterController.deleteDealer);

module.exports = router;