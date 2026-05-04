import express from 'express';
import {createTask, getTasks, getPendingTasks, updateTask, completeTask, deleteTask} from '../controllers/taskCont.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getTasks)
    .post(createTask);

router.get('/pending', getPendingTasks);

router.route('/:id')
    .put(updateTask)
    .delete(deleteTask);

router.patch('/:id/complete', completeTask);

export default router;
