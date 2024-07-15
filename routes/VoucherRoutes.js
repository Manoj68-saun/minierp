const express = require('express');
const VoucherController = require('../controllers/VoucherController');

const router = express.Router();


router.route('/').get(VoucherController.getAllVoucher)

router.route('/create-voucher').post(VoucherController.createVoucher);

router.route('/additional-data').get(VoucherController.getAdditionalData);


router
  .route('/:code')
  .get(VoucherController.getVoucherData)
  .patch(VoucherController.updateVoucher)
  .delete(VoucherController.deleteVoucher);

module.exports = router;
