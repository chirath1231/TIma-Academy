// backend/index.js
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Contact = require("./models/Contact");
const Course = require("./models/Course");
const CoursePrice = require("./models/CoursePrice");
const Admin = require("./models/Admin");
const app = express();
const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");
const Payment = require("./models/Payment");
const Order = require("./models/order");
const Cart = require("./models/Cart");

// store order temporarily
const tempOrders = {};

// ... other requires
app.use(express.urlencoded({ extended: true })); // required for x-www-form-urlencoded from PayHere
app.use(express.json());



app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"], 
  methods: ["GET", "POST" ,"DELETE"],
  credentials: true
}));

mongoose
  .connect("mongodb://127.0.0.1:27017/TimaAcademy", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
// create a simple GET endpoint to start payment (call from frontend)



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

// Delete a course price by ID
app.delete("/deleteCourse/:id", async (req, res) => {
  try {
    const courseId = req.params.id;
    // Delete course in courseprices collection
    await CoursePrice.deleteOne({ _id: courseId });
    // Also delete all videos with this coursename
    await Course.deleteMany({ coursename: courseName });
    res.json({ success: true, message: "Course and videos deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete a single video by ID
app.delete("/courses/delete/:id", async (req, res) => {
  try {
    const videoId = req.params.id;
    await Course.deleteOne({ _id: videoId });
    res.json({ success: true, message: "Video deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Fetch all videos
app.get("/getAllVideos", async (req, res) => {
  try {
    const videos = await Course.find({});
    res.json(videos);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


app.get("/getCourses", async (req, res) => {
  try {
    const courses = await CoursePrice.find({});
    res.json(courses);
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.post("/addCoursePrice", async (req, res) => {
  try {
    const { coursename, price, description } = req.body;

    const exist = await CoursePrice.findOne({ coursename });
    if (exist) {
      return res.json({ success: false, message: "Course already exists!" });
    }

    await CoursePrice.create({ coursename, price, description });

    res.json({ success: true, message: "Course added successfully!" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});



app.get("/getCoursePriceNames", async (req, res) => {
  const courses = await CoursePrice.find({});
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


// GET all videos for a specific course name (case-insensitive)
app.get("/courses/:coursename", async (req, res) => {
  try {
    const name = req.params.coursename;

    // Case-insensitive search using regex
    const videos = await Course.find({
      coursename: { $regex: `^${name}$`, $options: "i" },
    }).sort({ videonumber: 1 });

    if (!videos || videos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No videos found for this course",
      });
    }

    res.json({ success: true, videos });
  } catch (err) {
    console.error("Course details fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching course details",
    });
  }
});


// PayHere Sandbox Credentials
const crypto = require("crypto");

const merchantId = "1233030"; // YOUR MERCHANT ID
const merchantSecret = "MzQyNzA2NDk1ODEzODk2MzM4MzI5MDM1ODQ5NDgyODI0NjYwNTE5";


// helper MD5
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // required by PayHere




function md5(s) { return crypto.createHash("md5").update(String(s)).digest("hex"); }

// Create a PayHere payment and persist order in DB (instead of in-memory temp)
app.post("/createPayHerePayment", async (req, res) => {
  try {
    const { coursename, price, email } = req.body;

    if (!coursename || !price || !email) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const amount = Number(price).toFixed(2);
    const orderId = "ORDER_" + Date.now();
    const currency = "LKR";

    // Save order in DB
    await Order.create({
      order_id: orderId,
      coursename,
      email,
      amount,
      status: "pending"
    });

    // PayHere hash
    const hashedSecret = md5(merchantSecret).toUpperCase();
    const hash = md5(merchantId + orderId + amount + currency + hashedSecret).toUpperCase();

    return res.json({
      success: true,
      paymentData: {
        merchant_id: merchantId,
        return_url: "http://localhost:3000/paymentSuccess",
        cancel_url: "http://localhost:3000/paymentCancel",
        notify_url: "http://localhost:3001/payhere-notify",
        order_id: orderId,
        items: coursename,
        amount,
        currency,
        hash,
        first_name: email,
        last_name: "",
        email,
        phone: "0710000000",
        address: "N/A",
        city: "Colombo",
        country: "Sri Lanka"
      }
    });

  } catch (err) {
    console.error("createPayHerePayment error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.use(express.urlencoded({ extended: true })); // PayHere posts form data
app.use(express.json());


app.get("/getCart", async (req, res) => {
  try {
    const { email } = req.query;

    const items = await Cart.find({ email });

    return res.json({ success: true, items });
  } catch (err) {
    console.error("getCart error:", err);
    return res.status(500).json({ success: false });
  }
});

app.post("/payhere-notify", async (req, res) => {
  try {
    console.log("---- PAYHERE NOTIFY ----");
    console.log(req.body);

    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      payment_id
    } = req.body;

    // Validate Signature
    const signature = md5(
      merchant_id +
      order_id +
      payhere_amount +
      payhere_currency +
      status_code +
      md5(merchantSecret).toUpperCase()
    ).toUpperCase();

    if (signature !== md5sig) {
      console.log("❌ Invalid Signature");
      return res.status(400).send("Invalid Signature");
    }

    // Only status 2 is successful
    if (status_code !== "2") {
      console.log("Payment not completed");
      return res.send("OK");
    }

    // Fetch order
    const order = await Order.findOne({ order_id });
    if (!order) {
      console.log("❌ Order not found");
      return res.status(404).send("Order not found");
    }

    // -------------------------
    // SINGLE COURSE PAYMENT
    // -------------------------
    if (!order.items) {
      console.log("Processing SINGLE payment");

      await Payment.create({
        email: order.email,
        coursename: order.coursename,
        order_id,
        amount: order.amount,
        status: "Paid",
        payment_id
      });
    }

    // -------------------------
    // CART PAYMENT
    // -------------------------
    else {
      console.log("Processing CART payment");

      for (let item of order.items) {
        await Payment.create({
          email: order.email,
          coursename: item.coursename,
          order_id,
          amount: item.price,
          status: "Paid",
          payment_id
        });
      }

      // clear cart
      await Cart.deleteMany({ email: order.email });
    }

    // update order
    order.status = "paid";
    await order.save();

    console.log("✔ Payment processed successfully");
    return res.send("OK");

  } catch (err) {
    console.error("Notify error:", err);
    return res.sendStatus(500);
  }
});

app.get("/return-payment", async (req, res) => {
  const { order_id } = req.query;

  // update DB as fallback (for localhost)
  await Order.update({ status: "paid" }, { where: { order_id } });

  return res.redirect(`http://localhost:3000/paymentSuccess?order_id=${order_id}`);
});


app.post("/createCartPayment", async (req, res) => {
  try {
    const { email } = req.body;

    const cartItems = await Cart.find({ email });

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);

    const orderId = "ORDER_" + Date.now();
    const currency = "LKR";

    // Save order in DB
    await Order.create({
      order_id: orderId,
      email,
      items: cartItems, // 👈 Save all courses
      amount: totalAmount,
      status: "pending"
    });

    // Prepare PayHere hash
    const hashedSecret = md5(merchantSecret).toUpperCase();
    const hash = md5(merchantId + orderId + totalAmount + currency + hashedSecret).toUpperCase();

    return res.json({
      success: true,
      paymentData: {
        merchant_id: merchantId,
        return_url: "http://localhost:3000/paymentSuccess",
        cancel_url: "http://localhost:3000/paymentCancel",
        notify_url: "http://localhost:3001/payhere-notify",
        order_id: orderId,
        items: "Cart Purchase (" + cartItems.length + " items)",
        amount: totalAmount,
        currency,
        hash,
        first_name: email,
        last_name: "",
        email,
        phone: "0710000000",
        address: "N/A",
        city: "Colombo",
        country: "Sri Lanka"
      }
    });

  } catch (err) {
    console.error("createCartPayment error:", err);
    return res.status(500).json({ success: false });
  }
});


app.post("/payhere-notify-cart", async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig
    } = req.body;

    const localSig = md5(
      merchant_id +
      order_id +
      payhere_amount +
      payhere_currency +
      status_code +
      md5(merchantSecret).toUpperCase()
    ).toUpperCase();

    if (localSig !== md5sig) return res.status(400).send("Invalid signature");

    const order = await Order.findOne({ order_id });

    if (!order) return res.status(400).send("Order not found");

    if (status_code == "2") {
      // Payment Successful
      await Payment.create({
        email: order.email,
        coursename: "Cart Checkout",
        order_id,
        amount: order.amount,
        status: "Paid"
      });

      await Cart.deleteMany({ email: order.email });

      order.status = "paid";
      await order.save();
    }

    res.send("OK");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post("/confirmPayment", async (req, res) => {
  try {
    const { order_id } = req.body;

    const order = await Order.findOne({ order_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Mark order as paid
    order.status = "paid";
    await order.save();

    // Create coursename string for cart
    let coursename;

    if (order.items && order.items.length > 0) {
      coursename = order.items.map(i => i.coursename).join(", ");
    } else {
      coursename = order.coursename; // for single course payments
    }

    // Create payment
    const payment = await Payment.create({
      email: order.email,
      coursename: coursename,
      order_id: order.order_id,
      amount: order.amount,
      status: "paid",
      payhere_payment_id: req.body.payment_id || ""
    });

    console.log("✔ Payment saved:", payment);

    return res.json({ success: true });
  } catch (error) {
    console.warn("confirmPayment error:", error);
    return res.status(500).json({ error: error.message });
  }
});



app.get("/getPayments", async (req, res) => {
  const payments = await Payment.find({});
  res.json(payments);
});

app.delete("/deletePayment/:id", async (req, res) => {
  const id = req.params.id;
  await Payment.deleteOne({ _id: id });
  res.json({ success: true });
});



app.post("/addToCart", async (req, res) => {
  try {
    const { coursename, price, email } = req.body;

    if (!coursename || !price || !email) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    await Cart.create({ coursename, price, email });

    return res.json({ success: true, message: "Added to cart" });
  } catch (err) {
    console.error("addToCart error:", err);
    return res.status(500).json({ success: false });
  }
});


app.get("/paidCourses/:email", async (req, res) => {
  try {
    const email = req.params.email;

    // Get all *paid* records
    const payments = await Payment.find({ email, status: "paid" });

    if (!payments.length) {
      return res.json({ success: false, courses: [] });
    }

    let courses = [];

    payments.forEach(payment => {
      // Split multi-course strings: "beginner, Intermediate"
      const split = payment.coursename
        .split(",")
        .map(c => c.trim())
        .filter(c => c.length > 0);

      courses.push(...split);
    });

    // Remove duplicates
    const unique = [...new Set(courses)];

    res.json({ success: true, courses: unique });

  } catch (err) {
    console.error("paidCourses error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- GET ALL PAYMENTS ---
app.get("/getPayments", async (req, res) => {
  try {
    const payments = await Payment.find(); // fetch all payments
    res.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

app.delete("/removeCartItem/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await Cart.deleteOne({ _id: id });

    res.json({ success: true, message: "Item removed" });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// CHECK IF USER IS ADMIN (MONGO DB VERSION)
app.post("/api/check-admin", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ isAdmin: false });
  }

  try {
    const admin = await Admin.findOne({ email });

    if (admin) {
      return res.json({ isAdmin: true });
    } else {
      return res.json({ isAdmin: false });
    }

  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(500).json({ isAdmin: false });
  }
});




app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
