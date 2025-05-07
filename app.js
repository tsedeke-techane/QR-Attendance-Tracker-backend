// server.js
import express, { json, urlencoded } from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import classRoute from './routes/classRoute.js';
import teacherRoute from './routes/teacherRoute.js';
import attendanceRoute from './routes/attendanceRoutes.js';

config();
const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(json());

app.use('/api/auth', authRoutes);
app.use("/teacher",teacherRoute);
app.use("/class",classRoute);
app.use("/attendance",attendanceRoute);

const PORT = process.env.PORT || 5000;

connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));
