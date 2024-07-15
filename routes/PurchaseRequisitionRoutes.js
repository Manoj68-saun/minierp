const express = require("express");
const requisitionController = require("../controllers/purchaserequisitionController");

const router = express.Router();

router
  .route("/")
  .get(requisitionController.getAllRequisition)
  .post(requisitionController.createOpening);

router.route("/additional-data").get(requisitionController.getAdditionalData);
router.route("/ope-ningb-alance").get(requisitionController.OpeningValue);
router
  .route("/additional-data-of-hsn/:code")
  .get(requisitionController.getHsnForItem);
router
  .route("/:code")
  .get(requisitionController.getReqData)
  .patch(requisitionController.updateOpening)
  .delete(requisitionController.deleteOpening);

module.exports = router;
