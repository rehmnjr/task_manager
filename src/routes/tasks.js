const express = require('express');
const Task = require('../models/Task');
const authenticateToken = require('../middleware/authenticate');

const router = express.Router();

// router.use(express.json());

// Create Task (POST)
router.post('/create', authenticateToken, async (req, res) => {
    const { title, description, status } = req.body;

    if (!title || !description || !status) {
        return res.status(400).json({ message: 'Title, Description, and Status are required!' });
    }

    try {
        const task = new Task({ title, description, status, userId: req.user.userId });
        await task.save();
        res.status(201).json({ message: 'Task created successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update Task (PUT)
router.put('/update/:taskId', authenticateToken, async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status } = req.body;

    if (!title || !description || !status) {
        return res.status(400).json({ message: 'Title, Description, and Status are required!' });
    }

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You are not authorized to update this task' });
        }

        task.title = title;
        task.description = description;
        task.status = status;

        await task.save();

        res.status(200).json({ message: 'Task updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Delete Task (DELETE)
router.delete('/delete/:taskId', authenticateToken, async (req, res) => {
    const { taskId } = req.params; // Get the taskId from the URL

    if (!taskId) {
        return res.status(400).json({ message: 'taskId are required!' });
    }

    try {
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this task' });
        }

        await task.deleteOne();

        res.status(200).json({ message: 'Task deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get All Tasks (GET)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId });
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
