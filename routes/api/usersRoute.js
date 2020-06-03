const express = require('express');
const router = express.Router();
//For gravatar profile pic
const gravatar = require('gravatar');
//encrypt the password
const bcrypt = require('bcryptjs');
//jsonwebtoken
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: '../../config/config.env' });
const { check, validationResult } = require('express-validator');

//Bring user model for registration
const UserModel = require('../../models/UserModel');


//POST api/users
//Register user
//Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ 
        min: 6
     })
    //.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body;

    try {
    //See if user exists
    let findUser = await UserModel.findOne({ email }); //instead of saying findOne({ email: email }) for es6 or 7 is just the same
    
    if(findUser) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }
    //Get users gravatar
    const avatar = gravatar.url(email, {
        s: '200', //size
        r: 'pg', // rated pg photo
        d: 'mm' // To have some default pic if user doesn't have gravatar
    })

    findUser = new UserModel({
        name,
        email,
        avatar,
        password
    })

    //Encrypt password
    const salt = await bcrypt.genSalt(10);

    findUser.password = await bcrypt.hash(password, salt);

    await findUser.save();

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