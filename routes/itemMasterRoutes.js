const express = require('express');
const itemMasterController = require('../controllers/itemMasterController');

const router = express.Router();

router.route('/item-data').get(itemMasterController.getItemData)
// router.route('/attendance-data').get(itemMasterController.getAttendanceData)

router.route('/').get(itemMasterController.getAllItems).post(itemMasterController.createItem);

router.route('/additional-data').get(itemMasterController.getAdditionalData);

router
  .route('/:code')
  .get(itemMasterController.getItemData)
  .patch(itemMasterController.updateItem)
  .delete(itemMasterController.deleteItem);

module.exports = router;
