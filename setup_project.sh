#!/bin/bash

# Create the main project directory structure
mkdir -p my_project/{models,controllers,routes,middlewares,utils,config}

# Create and add code to files inside models
cat <<EOL > my_project/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: { type: String, enum: ['student', 'organizer'] },
    course: String,
    department: String
});

module.exports = mongoose.model('User', UserSchema);
EOL

cat <<EOL > my_project/models/Event.js
const mongoose = require('mongoose');

const SubEventSchema = new mongoose.Schema({
    name: String,
    overview: String,
    rules: String,
    venue: String,
    prizePool: [Number],
    targetedCourse: [String],
    targetedDepartment: [String]
});

const EventSchema = new mongoose.Schema({
    eventName: String,
    description: String,
    conductedDates: [Date],
    targetedAudience: {
        course: [String],
        department: [String]
    },
    institution: String,
    maxStudents: Number,
    maxEventsPerStudent: Number,
    organizingCollege: String,
    generalRules: String,
    contactInfo: String,
    subEvents: [SubEventSchema]
});

module.exports = mongoose.model('Event', EventSchema);
EOL

cat <<EOL > my_project/models/SubEvent.js
// No code provided for SubEvent.js in your example, so this is left blank
EOL

# Create and add code to files inside controllers
cat <<EOL > my_project/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    const { username, email, password, role, course, department } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role, course, department });
    await user.save();
    res.json({ message: 'User Registered' });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};
EOL

cat <<EOL > my_project/controllers/eventController.js
const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
    if (req.user.role !== 'organizer') return res.status(403).json({ message: 'Access Denied' });

    const event = new Event(req.body);
    await event.save();
    res.json({ message: 'Event Created' });
};

exports.getEvents = async (req, res) => {
    const events = await Event.find();
    res.json(events);
};
EOL

cat <<EOL > my_project/controllers/analyticsController.js
// No code provided for analyticsController.js in your example, so this is left blank
EOL

# Create and add code to files inside routes
cat <<EOL > my_project/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;
EOL

cat <<EOL > my_project/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const { createEvent, getEvents } = require('../controllers/eventController');
const { auth } = require('../middlewares/authMiddleware');

router.post('/create', auth, createEvent);
router.get('/', getEvents);

module.exports = router;
EOL

cat <<EOL > my_project/routes/analyticsRoutes.js
// No code provided for analyticsRoutes.js in your example, so this is left blank
EOL

# Create and add code to middleware
cat <<EOL > my_project/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'No Token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};
EOL

# Create and add code to utils
cat <<EOL > my_project/utils/scheduleAlgorithm.js
exports.scheduleEvents = (events) => {
    // Scheduling Algorithm Logic
    return events;
};
EOL

# Create and add code to config
cat <<EOL > my_project/config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;
EOL

# Create and add code to server.js
cat <<EOL > my_project/server.js
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
EOL

# Create and add code to package.json
cat <<EOL > my_project/package.json
{
  "name": "event-scheduler",
  "version": "1.0.0",
  "description": "A platform for event scheduling and management",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "mongoose": "^5.10.9",
    "dotenv": "^8.2.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^8.5.1"
  }
}
EOL

echo "Project structure with all files and code has been set up successfully!"
