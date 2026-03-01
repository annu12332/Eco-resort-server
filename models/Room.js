const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Room title is required"]
  },
  price: {
    type: Number,
    required: [true, "Price is required"]
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  },
  category: {
    type: String,
    default: 'Deluxe'
  },
  image: {
    type: String,
    default: ""
  },
  size: {
    type: String,
    default: "450 sqft"
  },
  bedType: {
    type: String,
    default: "King Size"
  },
  maxOccupancy: {
    adults: { type: Number, default: 2 },
    children: { type: Number, default: 0 }
  },
  amenities: {
    type: [String],
    default: ["Free WiFi", "Air Conditioning", "Ocean View"]
  },
  slug: {
    type: String,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);