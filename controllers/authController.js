const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const redisClient = require("../utils/redis_client");

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const  JWT_SECRET = "MeetAPI@2021";

exports.login = async function (req, res) {
    try {

        let user = await User.findOne({where:{email:req.body.email}});
        if (user===null){
            return res.status(200).json({
                status:1001,data:{
                    message: "Email ou mot de passe incorrect",
                    success: false
                }
            })
        }else{
                bcrypt.compare(req.body.password,user.password, async function(err, result) {
                    if (result===false){
                        return res.status(200).json({status:1002,data:{
                                message: "Email ou mot de passe incorrect",
                                success: false,
                            }})
                    }else{
                        const payload = {
                            check:  true
                        };
                        let token  = '';
                        try {
                            token = jwt.sign(payload, JWT_SECRET, {
                                //expiresIn: 1440 // expires in 24 hours
                            });
                        }catch (e) {
                            console.log("jwt error")
                        }
                        req.session.user = user;
                        req.session.save();
                        redisClient.set(req.session.id,JSON.stringify(user));
                        return res.status(200).send({status:200,data:{
                                error: false,
                                authorization_key: token,
                                user:user,
                                session_id:req.session.id
                            }});
                    }
                });
            }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status:500,
            data:{
                message: err,
                error: true}
        })
    }
};

exports.register = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const { body } = req;

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });

    }
    try {
        let result =  await Organisation.create(datas);
        //redisClient.set(req.session.id,JSON.stringify(user));
        res.status(200).json({ success: true, data: events, nbr: events.length })
    } catch (error) {
        next(error);
    }
    
    
})