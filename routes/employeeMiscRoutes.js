const express = require('express');
const miscEmployeeController = require('../controllers/employeeMiscController');

const router = express.Router();

router.route('/').get(miscEmployeeController.getAllTables);

router
  .route('/:slug')
  .get(miscEmployeeController.getTableData)
  .post(miscEmployeeController.createRow)
  .patch(miscEmployeeController.updateRow)
  .delete(miscEmployeeController.deleteRow);

module.exports = router;
