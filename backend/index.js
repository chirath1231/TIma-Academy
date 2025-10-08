// backend/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

mongoose
  .connect("mongodb://127.0.0.1:27017/TimaAcademy", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.post("/register", async (req, res) => {
  try {
    const fullname = req.body.fullname || req.body.fullName || "";
    const email = req.body.email;
    const password = req.body.password;

    if (!fullname || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullname, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { fullname: newUser.fullname, email: newUser.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success: false, message: "Invalid email or password" });

    return res.json({
      success: true,
      message: "Login successful",
      user: { fullname: user.fullname, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});

// Debug route to view users (no password)
app.get("/debug/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, users });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
