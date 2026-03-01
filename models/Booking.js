const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    roomId: { 
        type: String, 
        required: false, 
        default: "navbar_inquiry" 
    },
    roomTitle: { type: String, required: true },
    guestName: { type: String, required: true },
    email: { type: String, required: true }, 
    phone: { type: String, required: true }, 
    address: { type: String, required: true }, 
    members: { type: String, required: true }, 
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalPrice: { type: Number, default: 0 },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);