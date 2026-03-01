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

cottageSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }
  next();
});

module.exports = mongoose.model('Cottage', cottageSchema);