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
  type: [String],
    
    default:[] 
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

// ✅ PRE-SAVE HOOK WITH AUTO-UNIQUE SLUG
cottageSchema.pre('save', async function () {
  if (this.title && (this.isModified('title') || this.isNew)) {
    let baseSlug = this.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')       // multiple space handle
      .replace(/[^\w-]+/g, '');   // remove special char

    let slug = baseSlug;
    let count = 1;

    // Check if slug already exists in DB
    while (await mongoose.models.Cottage.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;  // add -1, -2, etc
    }

    this.slug = slug;
  }

  if (!this.slug) {
    throw new Error("Title is missing, cannot generate slug");
  }
});

module.exports = mongoose.model('Cottage', cottageSchema);