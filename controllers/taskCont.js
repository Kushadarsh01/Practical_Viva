import Task from "../models/taskModel.js";

export const createTask = async (req, res) => {
    try {
        const { 
            title,
            description,
            dueDate 
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required." });
        }

        const existingTask = await Task.findOne({ userId: req.user._id, title });
        
        if (existingTask) {
            return res.status(400)
            .json({
                message: "Task with this title already exists."
            });
        }

        const task = await Task.create({
            userId: req.user._id,
            title,
            description,
            dueDate
        });

        res.status(201).json(task);
    } 
    
    catch (error) {
        res.status(500)
        .json({
            message: error.message
        });
    }
};

export const getTasks = async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'Admin') {
            query.userId = req.user._id;
        }

        const tasks = await Task.find(query);

        if (tasks.length === 0) {
            return res.status(404)
            .json({
                message: "Tasks not found."
            });
        }

        res.json(tasks);
    } 
    
    catch (error) {
        res.status(500)
        .json({
            message: error.message
        });
    }
};

export const getPendingTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            userId: req.user._id,
            status: false
        });

        if (tasks.length === 0) {
            return res.status(404).json({ message: "No pending tasks found." });
        }

        res.json(tasks);
    } 
    
    catch (error) {
        res.status(500)
        .json({
            message: error.message
        });
    }
};

export const updateTask = async (req, res) => {
    try {
        const {
            title, 
            description, 
            dueDate
        } = req.body;

        const task = await Task.findOneAndUpdate(
            {
                userId: req.user._id,
                _id: req.params.id
            },
            {
                title,
                description,
                dueDate
            },
            { new: true }
        );

        if (!task) {
            return res.status(404)
            .json({
                message: "Task not found."
            });
        }

        res.json(task);
    } 
    
    catch (error) {
        res.status(500)
        .json({
            message: error.message
        });
    }
};

export const completeTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            {
                userId: req.user._id,
                _id: req.params.id,
            },
            { status: true },
            { new: true }
        );

        if (!task) {
            return res.status(404)
            .json({
                message: "Task not found."
            });
        }

        res.json(task);
    } 
    
    catch (error) {
        res.status(500)
        .json({
            message: error.message
        });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            userId: req.user._id,
            _id: req.params.id,
        });

        if (!task) {
            return res.status(404)
            .json({
                message: "Task not found."
            });
        }

        res.json({ message: "Task deleted" });
    } 
    
    catch (error) {
        res.status(500)
        .json({ 
            message: error.message
        });
    }
};