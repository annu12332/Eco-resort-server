const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, 
    price: { type: Number, required: false },
    duration: { type: String, required: false },
    location: { type: String, default: 'On-site' }
}, { timestamps: false});

module.exports = mongoose.model('Activity', activitySchema);