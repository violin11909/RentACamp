const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    campgroundId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campground",
      required: true,
    },
    userName: {
      type: String,
      required: [true, "Please fill a user name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    tel: {
      type: String,
    },
    number: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["success", "pending", "canceled"],
      default: "pending", 
    },
    checkIn: {
      type: Date,
      required: [true, "Please fill check-in date"],
    },
    checkOut: {
      type: Date,
      required: [true, "Please fill check-out date"],
    },
});

module.exports = mongoose.model("Booking", BookingSchema);
