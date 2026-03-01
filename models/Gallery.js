const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
    image: { type: String, required: true },
    title: String,
}, { timestamps: true });

module.exports = mongoose.model('Gallery', GallerySchema);