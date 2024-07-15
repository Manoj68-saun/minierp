const express = require('express');
const miscSalesController = require('../controllers/salesMiscController');

const router = express.Router();

router.route('/').get(miscSalesController.getAllTables);

router
  .route('/:slug')
  .get(miscSalesController.getTableData)
  .post(miscSalesController.createRow)
  .patch(miscSalesController.updateRow)
  .delete(miscSalesController.deleteRow);

module.exports = router;
