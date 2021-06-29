const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');

exports.register = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const { body } = req;

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });

    }
    try {
        let result =  await Organisation.create(datas);
        res.status(200).json({ success: true, data: events, nbr: events.length })
    } catch (error) {
        next(error);
    }
    
    
})