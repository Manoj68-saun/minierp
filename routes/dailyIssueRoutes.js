const express = require("express");
const openingController = require("../controllers/dailyessueController");

const router = express.Router();

router
  .route("/")
  .get(openingController.getAllIssue)
  .post(openingController.createOpening);
router.route("/additional-data-of-req").get(openingController.getAllReq);
router.route("/additional-data/:code").get(openingController.getAllReqdata);
router.route("/additional-data").get(openingController.getAdditionalData);
router.route("/ope-ningb-alance").get(openingController.OpeningValue);
router
  .route("/additional-data-of-hsn/:code")
  .get(openingController.getHsnForItem);
router
  .route("/:code")
  .get(openingController.getdailyissueData)
  .patch(openingController.updateOpening)
  .delete(openingController.deleteOpening);

module.exports = router;
