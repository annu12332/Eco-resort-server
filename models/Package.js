const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    features: { type: [String], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Package', PackageSchema);