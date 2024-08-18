/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {} from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { userRoutes } from './app/routes/user.routes';
import { app } from '../src/app/socket/index';
// const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// application routers
app.use('/api/user', userRoutes);

// global error handler-------
app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
