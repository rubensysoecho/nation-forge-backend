import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import nationRoutes from './routes/nationRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

connectDB();

app.use('/api/nation', nationRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
