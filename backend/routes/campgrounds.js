const express = require("express");
const {
  getCampgrounds,
  getCampground,
  createCampground,
  updateCampground,
  deleteCampground,
} = require("../controllers/campgrounds");
const { authorize, protect } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(getCampgrounds)
  .post(createCampground);
router
  .route("/:id")
  .get(getCampground)
  .put(protect, authorize(["admin"]), updateCampground)
  .delete(protect, authorize(["admin"]), deleteCampground);

module.exports = router;
