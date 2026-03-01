// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios'); 
require('dotenv').config();

// Models
const Cottage = require('./models/AddCottage'); 
const RoomBooking = require('./models/RoomBooking');
const Gallery = require('./models/Gallery');
const Offer = require('./models/Offers'); 
const Blog = require('./models/Blog'); 
const Package = require('./models/Package'); 

const app = express();

// Middleware
app.use(cors({ origin: "*" })); 
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.log("❌ DB Error:", err.message));

// --- COTTAGE API ROUTES ---
// GET all cottages
app.get('/api/cottages', async (req, res) => {
    try {
        const cottages = await Cottage.find().sort({ createdAt: -1 });
        res.status(200).json(cottages);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST new cottage
app.post('/api/cottages', async (req, res) => {
    try {
        const { images, ...otherData } = req.body;
        
        const cottageData = {
            ...otherData,
            image: images && Array.isArray(images) ? images : [],
        };

        const newCottage = new Cottage(cottageData);
        await newCottage.save();
        res.status(201).json(newCottage);
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT update cottage
app.put('/api/cottages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCottage = await Cottage.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        res.status(200).json(updatedCottage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE cottage
app.delete('/api/cottages/:id', async (req, res) => {
    try {
        await Cottage.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Cottage deleted" });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// --- SINGLE COTTAGE (ID or Slug) ---
// This fixes the 500 error when frontend sends slug instead of ID
app.get('/api/cottages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let cottage;

        if (mongoose.Types.ObjectId.isValid(id)) {
            // If valid ObjectId, find by _id
            cottage = await Cottage.findById(id);
        } else {
            // Otherwise, try find by slug
            cottage = await Cottage.findOne({ slug: id });
        }

        if (!cottage) {
            return res.status(404).json({ success: false, message: "Cottage not found" });
        }

        res.status(200).json(cottage);
    } catch (error) {
        console.error("Fetch Cottage Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- COTTAGE & PACKAGE BOOKING ROUTES ---
app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new RoomBooking(req.body);
        await newBooking.save();

        if (process.env.TELEGRAM_BOT_TOKEN) {
            const msg = `🔔 *New Cottage Booking!* \n🏡 Cottage: ${req.body.cottageTitle} \n👤 Guest: ${req.body.guestName} \n📞 Phone: ${req.body.phone}`;
            axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: msg,
                parse_mode: 'Markdown'
            }).catch(e => console.log("Telegram Notification Failed"));
        }

        res.status(201).json({ success: true, data: newBooking, message: "Booking Successful!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PACKAGE BOOKING
app.post('/api/package-bookings', async (req, res) => {
    try {
        const packageBooking = new RoomBooking({ ...req.body });
        await packageBooking.save();

        if (process.env.TELEGRAM_BOT_TOKEN) {
            const msg = `🎁 *New Package Booking!* \n📦 Package: ${req.body.cottageTitle} \n👤 Guest: ${req.body.guestName}`;
            axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: msg,
                parse_mode: 'Markdown'
            }).catch(e => console.log("Telegram Failed"));
        }

        res.status(201).json({ success: true, message: "Package Booked Successfully!", data: packageBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await RoomBooking.find().sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PATCH booking status
app.patch('/api/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedBooking = await RoomBooking.findByIdAndUpdate(
            id, 
            { $set: { status: status } }, 
            { new: true }
        );
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE booking
app.delete('/api/bookings/:id', async (req, res) => {
    try {
        await RoomBooking.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Booking removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- GALLERY API ---
app.get('/api/gallery', async (req, res) => {
    try {
        const photos = await Gallery.find().sort({ createdAt: -1 });
        res.json(photos);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/gallery', async (req, res) => {
    try {
        const newPhoto = new Gallery(req.body);
        await newPhoto.save();
        res.status(201).json(newPhoto);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// --- OFFERS API ---
app.get('/api/offers', async (req, res) => {
    try {
        const offers = await Offer.find().sort({ createdAt: -1 });
        res.status(200).json(offers);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/offers', async (req, res) => {
    try {
        const newOffer = new Offer(req.body);
        await newOffer.save();
        res.status(201).json(newOffer);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

app.delete('/api/offers/:id', async (req, res) => {
    try {
        await Offer.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Offer deleted" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- BLOG API ---
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.json(blog);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/blogs', async (req, res) => {
    try {
        const newBlog = new Blog(req.body);
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

app.put('/api/blogs/:id', async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedBlog);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/blogs/:id', async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Blog deleted" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- PACKAGE API ---
app.get('/api/packages', async (req, res) => {
    try {
        const packages = await Package.find().sort({ createdAt: -1 });
        res.json(packages);
    } catch (err) { res.status(500).json([]); }
});

app.get('/api/packages/:id', async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        res.json(pkg);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/packages', async (req, res) => {
    try {
        const newPkg = new Package(req.body);
        await newPkg.save();
        res.status(201).json(newPkg);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

app.put('/api/packages/:id', async (req, res) => {
    try {
        const updatedPkg = await Package.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(updatedPkg);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/packages/:id', async (req, res) => {
    try {
        await Package.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Package deleted" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- ADMIN STATS ---
app.get('/api/admin/stats', async (req, res) => {
    try {
        const totalCottages = await Cottage.countDocuments();
        const totalPackages = await Package.countDocuments();
        const bookings = await RoomBooking.find();
        
        res.status(200).json({
            totalCottages,
            totalPackages,
            totalBookings: bookings.length,
            pendingBookings: bookings.filter(b => b.status === 'Pending').length
        });
    } catch (error) { res.status(500).json({ success: false }); }
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));