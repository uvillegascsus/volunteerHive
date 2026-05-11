const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
