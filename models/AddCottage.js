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
  // ক্যাটাগরি হিসেবে কটেজের ধরণ (যেমন- Bamboo, Clay)
  category: {
    type: String,
    default: 'Bamboo Cabin'
  },
  image: {
    type: String,
    default: ""
  },
  // কটেজের আকার (যেমন- 400 sqft)
  size: {
    type: String,
    default: "400 sqft"
  },
  // বিছানার ধরন (যেমন- King Size)
  bedType: {
    type: String,
    default: "King Size"
  },
  // ধারণক্ষমতা (অ্যাডাল্ট ও চাইল্ড)
  maxOccupancy: {
    adults: { type: Number, default: 2 },
    children: { type: Number, default: 1 }
  },
  // কটেজের বিশেষ সুবিধাসমূহ (যেমন- Solar Power, River View)
  amenities: {
    type: [String],
    default: ["Solar Power", "River View", "Private Deck"]
  },
  // কটেজের অবস্থান (নতুন ফিল্ড)
  location: {
    type: String,
    default: "Eco Village"
  },
  // কটেজের স্ট্যাটাস (Available, Booked)
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

// --- UPDATED PRE-SAVE HOOK WITH ERROR HANDLING ---
cottageSchema.pre('save', function(next) {
  try {
    // Check if title exists to avoid errors
    if (this.title && (this.isModified('title') || this.isNew)) {
      this.slug = this.title
        .toLowerCase()
        .trim()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    }
    
    // Safety check: if title is missing, prevent save
    if (!this.slug) {
        throw new Error("Title is missing, cannot generate slug");
    }

    next(); // Always call next()
  } catch (error) {
    // If error occurs, pass it to next()
    next(error);
  }
});

module.exports = mongoose.model('Cottage', cottageSchema);