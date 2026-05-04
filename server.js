import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/dbConfig.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server up at port => : ${port}`);
});