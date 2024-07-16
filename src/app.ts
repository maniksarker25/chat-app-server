/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {} from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(globalErrorHandler);

export default app;
