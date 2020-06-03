const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '../../config/config.env' });
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const UserModel = require('../../models/UserModel');


//GET api/auth
//Get logged in user data except password  or Get user by token
//Private
router.get('/', auth, async (req, res) => {
    try {
        //req.user.id came from payload on jwt during user registration
        const user = await UserModel.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!')
    }
})



//POST api/auth
//Authenticate user or Login route
//Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    try {
    //See if user exists
    let findUser = await UserModel.findOne({ email }); //instead of saying findOne({ email: email }) for es6 or 7 is just the same
    
    if(!findUser) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Email' }] });
    }

    //Compare password for bcrypt
    const isMatch = await bcrypt.compare(password, findUser.password);

    if(!isMatch){
        return res.status(400).json({ errors: [{ msg: 'Invalid password' }] })
    }

    //Return jsonwebtoken
    const payload = {
        user: {
            id: findUser.id
        }
    }

    jwt.sign(payload, process.env.JwtSecret, { expiresIn: 360000 }, (err, token) => {
        if(err) throw err;
        res.json({ token })
    });
    
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error!')
    }
 

   
})

module.exports = router;