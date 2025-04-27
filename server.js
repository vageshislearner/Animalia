const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/animalAdoptionDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define Schema for Adoptions
const adoptionSchema = new mongoose.Schema({
    petName: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    experience: { type: String, required: true },
    homeType: { type: String, required: true },
    familyMembers: { type: Number, required: true },
    yard: { type: String, required: true },
    reason: { type: String, required: true },
    otherPets: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Adoption = mongoose.model("Adoption", adoptionSchema);

// Volunteer Schema
const volunteerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    availability: { type: String, required: true },
    comments: { type: String },
    agreed: { type: Boolean, required: true },
    roles: {
        rescuer: Boolean,
        caretaker: Boolean,
        fosterer: Boolean,
        trainer: Boolean,
        foodService: Boolean,
        other: Boolean
    }
}, { timestamps: true });

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model("Contact", contactSchema);


// Add this with your other routes (before error handlers)
app.post("/submit-contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required"
            });
        }

        const newContact = new Contact({
            name,
            email,
            message
        });

        await newContact.save();

        res.status(201).json({
            success: true,
            message: "Thank you for your message!",
            data: newContact
        });
    } catch (error) {
        console.error("Contact submission error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit contact form",
            error: error.message
        });
    }
});

// API Route to Handle Adoption Applications
app.post("/submit-adoption", async (req, res) => {
    try {
        const {
            petName,
            fullName,
            email,
            phone,
            address,
            experience,
            homeType,
            familyMembers,
            yard,
            reason,
            otherPets
        } = req.body;

        // Check required fields
        if (!petName || !fullName || !email || !phone || !address || !experience || 
            !homeType || !familyMembers || !yard || !reason) {
            return res.status(400).json({ message: "❌ All required fields must be filled!" });
        }

        const newAdoption = new Adoption({
            petName,
            fullName,
            email,
            phone,
            address,
            experience,
            homeType,
            familyMembers,
            yard,
            reason,
            otherPets
        });

        await newAdoption.save();

        res.status(201).json({ 
            message: "✅ Adoption application submitted successfully!", 
            data: newAdoption 
        });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ 
            message: "❌ Failed to submit adoption application", 
            error: error.message 
        });
    }
});

// Volunteer Registration Endpoint
app.post("/register", async (req, res) => {
    try {
        const { name, email, phone, availability, comments, agreed, roles } = req.body;

        // Validation
        if (!name || !email || !phone || !availability || agreed === undefined) {
            return res.status(400).json({ 
                success: false,
                message: "All required fields must be filled"
            });
        }

        // Check for existing email
        const existingVolunteer = await Volunteer.findOne({ email });
        if (existingVolunteer) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const newVolunteer = new Volunteer({
            name,
            email,
            phone,
            availability,
            comments,
            agreed,
            roles
        });

        await newVolunteer.save();

        res.status(201).json({
            success: true,
            message: "Volunteer registration successful",
            data: newVolunteer
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
});

// Test endpoint
app.get("/test", (req, res) => {
    res.json({ success: true, message: "Server is working!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// 404 handler (MUST BE LAST)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));