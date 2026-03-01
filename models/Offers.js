const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    validity: { type: String, required: true },
    imageUrl: { type: String, required: true },
    discount: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);