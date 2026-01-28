import express from 'express';

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/authRoute.ts';
import userRoutes from './routes/userRoute.ts';
import habitRoutes from './routes/habitRoute.ts';
import { isTest } from '../env.ts';

const app = express();

app.use(cors()); // ? for cross origin resource sharing
app.use(helmet()); // ? for website request security and all
app.use(express.json()); // ? for ability to access req.body as a JS object
app.use(express.urlencoded({ // ? to be able to access the url query params without issues
    extended: true
}))
app.use( // ? for console logging
    morgan('dev', {
        skip: () => isTest()
    })
);

app.get('/health', (req, res) => {
    res.send(true);
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);

export { app }

export default app;