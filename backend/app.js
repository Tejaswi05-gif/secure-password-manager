const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const cors = require('cors');

const MasterUser = require('./models/masterUser');
const Password = require('./models/Password');
const Student = require('./models/Student');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

app.get('/', (req, res) => {
  res.json({ message: 'Password Manager API is running' });
});

app.get('/api/master/status', async (req, res) => {
  try {
    const exists = await MasterUser.exists({});
    res.json({ registered: Boolean(exists) });
  } catch (err) {
    res.status(500).json({ message: 'Unable to check master password status' });
  }
});

app.post('/api/master/register', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Master password is required' });
    }

    const existingUser = await MasterUser.findOne();

    if (existingUser) {
      return res.status(409).json({ message: 'Master password already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await MasterUser.create({ masterPassword: hashedPassword });

    res.status(201).json({ message: 'Master password registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Unable to register master password' });
  }
});

app.post('/api/master/login', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Master password is required' });
    }

    const user = await MasterUser.findOne();

    if (!user) {
      return res.status(404).json({ message: 'No master password registered' });
    }

    const isMatch = await bcrypt.compare(password, user.masterPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong master password' });
    }

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Unable to login' });
  }
});

app.get('/api/passwords', async (req, res) => {
  try {
    const passwords = await Password.find().sort({ createdAt: -1 });
    res.json(passwords);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch passwords' });
  }
});

app.post('/api/passwords', async (req, res) => {
  try {
    const { website, username, password } = req.body;

    if (!website || !username || !password) {
      return res.status(400).json({ message: 'Website, username, and password are required' });
    }

    const savedPassword = await Password.create({ website, username, password });
    res.status(201).json(savedPassword);
  } catch (err) {
    res.status(500).json({ message: 'Unable to save password' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { name, regno, marks, address, email } = req.body;
    const numericMarks = Number(marks);

    if (!name || !regno || !address || !email || marks === undefined || marks === '') {
      return res.status(400).json({ message: 'Name, registration number, marks, address, and email are required' });
    }

    if (Number.isNaN(numericMarks)) {
      return res.status(400).json({ message: 'Marks must be numeric' });
    }

    const student = await Student.create({
      name: name.trim(),
      regno: regno.trim(),
      marks: numericMarks,
      address: address.trim(),
      email: email.trim()
    });

    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: 'Unable to save student details' });
  }
});

app.get('/api/students/analytics', async (req, res) => {
  try {
    const rangeCounts = await Student.aggregate([
      {
        $bucket: {
          groupBy: '$marks',
          boundaries: [0, 41, 71, 101],
          default: 'Other',
          output: {
            count: { $sum: 1 }
          }
        }
      },
      {
        $project: {
          _id: 0,
          range: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 0] }, then: '0-40' },
                { case: { $eq: ['$_id', 41] }, then: '41-70' },
                { case: { $eq: ['$_id', 71] }, then: '71-100' }
              ],
              default: 'Other'
            }
          },
          count: 1
        }
      }
    ]);
    const rangeCountMap = new Map(rangeCounts.map((item) => [item.range, item.count]));
    const visibleRangeCounts = ['0-40', '41-70', '71-100'].map((range) => ({
      range,
      count: rangeCountMap.get(range) || 0
    }));

    const sortedStudents = await Student.find({}, { name: 1, marks: 1, _id: 0 })
      .sort({ marks: -1, name: 1 });

    res.json({
      rangeCounts: visibleRangeCounts,
      sortedStudents
    });
  } catch (err) {
    res.status(500).json({ message: 'Unable to load student analytics' });
  }
});

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
