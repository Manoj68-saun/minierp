const express = require("express");
const GaugePolicyController = require("../controllers/GaugePolicyController");

const router = express.Router();

router
  .route("/additional-data-of-sz/:code")
  .get(GaugePolicyController.getSizeForItem);

router.route("/").get(GaugePolicyController.getAllGauge);

router.route("/create-gauge").post(GaugePolicyController.createGauge);

router.route("/additional-data").get(GaugePolicyController.getAdditionalData);
router.route("/new/:code").get(GaugePolicyController.getGauge);
router
  .route("/:code")
  .get(GaugePolicyController.getGaugeData)

  .patch(GaugePolicyController.updateGauge)
  .delete(GaugePolicyController.deleteGauge);

module.exports = router;
