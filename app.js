// app.js
const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRouter');
const connectDB = require('./db');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
connectDB();

app.use(bodyParser.json());
app.use('/api/users', userRouter);

module.exports = app;
