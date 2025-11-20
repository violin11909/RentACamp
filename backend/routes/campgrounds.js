const express = require("express");
const { getCampgrounds, getCampground, createCampground, updateCampground, deleteCampground, } = require("../controllers/campgrounds");
const { authorize, protect } = require("../middleware/auth");
const bookings = require('./booking');

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
router.use('/:campgroundId/bookings', bookings)

module.exports = router;

