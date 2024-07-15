const express = require("express");
const openingController = require("../controllers/oneningBalance");

const router = express.Router();

router
  .route("/")
  .get(openingController.getAllOpenning)
  .post(openingController.createOpening);

router.route("/additional-data").get(openingController.getAdditionalData);
router.route("/ope-ningb-alance").get(openingController.OpeningValue);
router
  .route("/additional-data-of-hsn/:code")
  .get(openingController.getHsnForItem);
router
  .route("/:code")
  .get(openingController.getOpeningData)
  .patch(openingController.updateOpening)
  .delete(openingController.deleteOpening);

module.exports = router;
