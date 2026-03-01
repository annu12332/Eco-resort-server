// models/PackageBooking.js
const mongoose = require('mongoose');

const packageBookingSchema = new mongoose.Schema({
    packageId: { type: String, required: true },
    packageTitle: { type: String, required: true },
    guestName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    members: { type: String, required: true }, // Guests
    checkIn: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('PackageBooking', packageBookingSchema);