const express = require("express");
const {
  getRequests,
  getRequest,
  createRequest,
  deleteRequest,
  updateRequest,
} = require("../controllers/booking");
const { authorize, protect } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(protect, getRequests)
  .post(protect, createRequest);
router
  .route("/:id")
  .get(protect, getRequest)
  .put(protect, updateRequest)
  .delete(protect, authorize("user", "admin"), deleteRequest);

module.exports = router;
