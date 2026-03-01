const mongoose = require('mongoose');

const cottageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Cottage title is required"],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Price per night is required"]
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  },
  category: {
    type: String,
    default: 'Bamboo Cabin'
  },
  image: {
    type: String,
    default: ""
  },
  size: {
    type: String,
    default: "400 sqft"
  },
  bedType: {
    type: String,
    default: "King Size"
  },
  maxOccupancy: {
    adults: { type: Number, default: 2 },
    children: { type: Number, default: 1 }
  },
  amenities: {
    type: [String],
    default: ["Solar Power", "River View", "Private Deck"]
  },
  location: {
    type: String,
    default: "Eco Village"
  },
  status: {
    type: String,
    enum: ['Available', 'Booked', 'Maintenance'],
    default: 'Available'
  },
  slug: {
    type: String,
    unique: true
  }
}, { timestamps: true });


// ✅ FIXED PRE-SAVE HOOK (NO next, NO callback mix)
cottageSchema.pre('save', async function () {

  // Generate slug only if title changed or new document
  if (this.title && (this.isModified('title') || this.isNew)) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')       // multiple space handle
      .replace(/[^\w-]+/g, '');   // remove special char
  }

  // Safety check
  if (!this.slug) {
    throw new Error("Title is missing, cannot generate slug");
  }

});

module.exports = mongoose.model('Cottage', cottageSchema);