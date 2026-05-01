const express = require('express');
const mongoose = require('moongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
app.use(express.json());

//Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'));
app.use('/api/registrations', require('./routes/registrations'));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error('MongoDB connection error:', err));