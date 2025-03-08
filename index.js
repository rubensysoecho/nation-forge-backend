import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import connectDB from './config/db.js';
import nationRoutes from './routes/nationRoutes.js';
import warRoutes from './routes/warRoutes.js'
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(express.json());

connectDB();

app.use('/api/nation', nationRoutes);
app.use('/api/war', warRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
