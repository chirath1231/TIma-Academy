// backend/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Contact = require("./models/Contact");
const Course = require("./models/Course");
const Admin = require("./models/Admin");
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

app.post("/addCourse", async (req, res) => {
  try {
    const { coursename, videonumber, videolink, description } = req.body;

    if (!coursename || !videonumber || !videolink || !description) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const newCourse = new Course({
      coursename,
      videonumber,
      videolink,
      description,
    });

    await newCourse.save();

    res.json({ success: true, message: "Course added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/getCourses", async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
});



app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ success: false, message: "Invalid email or password" });

    // CHECK IF EMAIL EXISTS IN THE ADMIN COLLECTION
    const admin = await Admin.findOne({ email });

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        fullname: user.fullname,
        email: user.email,
        isAdmin: admin ? true : false, 
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});



// Debug route to view users (no password)
app.get("/debug/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, users });
});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ success: false, message: "Server error while sending message" });
  }
});



// Add a new course
app.post("/courses/add", async (req, res) => {
  try {
    const { coursename, videonumber, videolink, description } = req.body;

    if (!coursename || !videonumber || !videolink || !description) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const newCourse = new Course({
      coursename,
      videonumber,
      videolink,
      description,
    });

    await newCourse.save();

    res.status(201).json({ success: true, message: "Course added successfully" });
  } catch (err) {
    console.error("Course add error:", err);
    res.status(500).json({ success: false, message: "Server error adding course" });
  }
});

// Fetch all courses
app.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ success: true, courses });
  } catch (err) {
    console.error("Courses fetch error:", err);
    res.status(500).json({ success: false, message: "Server error fetching courses" });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
