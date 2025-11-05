const mongoose = require("mongoose");

const CampgroundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  price: {
    type: Number,
  },
  address: {
    type: String,
    required: [true, "Please add a address"],
  },
  district: {
    type: String,
    required: [true, "Please add a districe"],
  },
  province: {
    type: String,
    required: [true, "Please add a province"],
  },
  postalcode: {
    type: String,
    required: [true, "Please add a postalcode"],
    maxlength: [5, "Postal Code can not be more than 5 digits"],
  },
  lat: {
    type: Number,
    required: [true, "Please provide the latitude of this campground"],
  },
  lng: {
    type: Number,
    required: [true, "Please provide the longitude of this campground"],
  },
  tel: {
    type: String,
  },
  images: {
    type: Array,
  },
  maxGuests: {
    type: Number,
    required: [true, "Please provide the maximum number of guests"],
  },
  petsAllowed: {
    type: Boolean,
    required: [true, "Please specify whether pets are allowed"],
  },
  startCheckIn: {
    type: Date,
    required: [true, "Please provide the start check-in time"],
  },
  endCheckIn: {
    type: Date,
    required: [true, "Please provide the end check-in time"],
  },
  checkOut: {
    type: Date,
    required: [true, "Please provide the check-out time"],
  },
  parking: {
    type: Boolean,
    required: [true, "Please specify if parking is available"],
  },
  detail: {
    type: String,
    required: [true, "Please provide additional details about the campground"],
    maxlength: [1000, "Detail can not be more than 1000 characters"],
  },
});

module.exports = mongoose.model("Campground", CampgroundSchema);
