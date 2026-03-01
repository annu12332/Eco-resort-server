const mongoose = require('mongoose');

const roomBookingSchema = new mongoose.Schema({
    // রুমের ডিটেইলস (RoomDetails.jsx থেকে আসছে)
    roomId: {
        type: String,
        required: true
    },
    roomTitle: {
        type: String,
        required: true
    },

    // আপনার ফর্মের ইনপুট ফিল্ডগুলো
    guestName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    members: {
        type: String, // ফ্রন্টএন্ড থেকে আসা মেম্বার সংখ্যা
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },

    // ডিফল্ট স্ট্যাটাস
    status: {
        type: String,
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('RoomBooking', roomBookingSchema);