const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const ProfileModel = require('../../models/ProfileModel');

router.get('/me', auth, async (req, res) => {
   try {
    const profile = await ProfileModel.findOne({ user: req.user.id  }).populate('user', ['name, avatar']);

    if(!profile){
        return res.status(400).json({ msg: 'No profile for this user' });
    }
    res.json(profile);
   } catch (err) {
       console.error(err.message);
       res.status(500).send('Server error!')
   }
})

