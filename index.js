const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const cors = require('cors');
app.use(cors());
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://vishwathmaprakash:Vishwathma@cluster0.nrmwe.mongodb.net/habitflo1?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// User Schema for storing user info
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Task Schema for storing tasks related to a particular user

const taskSchema = new mongoose.Schema({
    email: { type: String},
    title: { type: String },
    description: { type: String },
    dueDate: { type: Date },
});

const Task = mongoose.model('Task', taskSchema);

app.post('/api/tasks', async (req, res) => {
    const { email, title, description, dueDate } = req.body;
    try {
        const newTask = new Task({ email, title, description, dueDate });
        await newTask.save();
        res.status(201).json({ success: true, message: 'Task added successfully', task: newTask });
    } catch (error) {
        console.error('Add task error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while adding the task' });
    }
});
// Signup route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        if (error.code === 11000) {
            res.status(400).json({ success: false, message: 'Email already exists' });
        } else {
            res.status(500).json({ success: false, message: 'An error occurred' });
        }
    }
});

// Login route to handle user login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

// Route to add a new task for a specific user



// Route to fetch tasks for a specific user by email
app.get('/api/tasks/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const tasks = await Task.find({ email });
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        console.error('Fetch tasks error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching tasks' });
    }
});

// Serve the login page as the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
