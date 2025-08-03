// === AUTH SERVER (server.js) ===
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Handles JSON bodies

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  age: String,
  standard: String,
  email: { type: String, unique: true },
  password: String
});
const User = mongoose.model('User', userSchema);

// === Health check ===
app.get('/', (req, res) => {
  res.send('✅ Auth API is running');
});

// === Register API ===
app.post('/api/register', async (req, res) => {
  const { name, age, standard, email, password } = req.body;

  console.log("📥 Received registration data:", req.body);

  try {
    if (!name || !age || !standard || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ Email already registered");
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      age,
      standard,
      email,
      password: hashedPassword
    });

    await newUser.save();
    console.log("✅ User registered:", email);
    res.status(200).json({ message: 'Registration successful' });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// === Login API ===
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("🔑 Login attempt for:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
