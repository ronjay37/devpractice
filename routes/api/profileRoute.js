const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const { check, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config({ path: '../../config/config.env' });

const ProfileModel = require('../../models/ProfileModel');
const UserModel = require('../../models/UserModel');
const PostModel = require('../../models/PostModel');


//GET api/profile/me
//Get current users profile
//Private
router.get('/me', auth, async (req, res) => {
    try {
        //user: came from ref user on User model which will be the user field once the profile created
        //user from .populate is the collection user
        const profile = await ProfileModel.findOne({ user: req.user.id }).populate('user', ['name','avatar']);

        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
})


//POST api/profile/
//Create or update a user profile
//Private

router.post('/', [auth, [
    check('status', 'Status is required!').not().isEmpty(),
    check('skills', 'Skills are required!').not().isEmpty()
] ], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });

    }

    const {
        company,website,location,bio,status,githubusername,
        skills,youtube,facebook,twitter,instagram,
        linkedin
    } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;

    if(skills) {
        profileFields.skills = skills.split(',').map((skill) => skill.trim())
    }

      // console.log(profileFields.skills); This is just to test the skills fields if working with ','
    // res.send('Hello')

    //Build social object
    profileFields.social = {}

    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try {

        //new code on final 
        let profile = await ProfileModel.findOneAndUpdate(
            { user: req.user.id }, 
            { $set: profileFields },
            {new: true, upsert: true});

            res.json(profile);
        // let profile = await ProfileModel.findOne({ user: req.user.id });
        // if(profile){
            //Update
            // profile = await ProfileModel.findOneAndUpdate({ user: req.user.id }, {$set: 
            // profileFields },
            // { new: true } )

        //     return res.json(profile);
        // }

        //Create
        // profile = new ProfileModel(profileFields);

        // await profile.save();
        // res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }

})



//GET api/profile
//Get all profiles
//Public

router.get('/', async (req, res) => {
    try {
        const profiles = await ProfileModel.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
})



//GET api/profile/user/:user_id
//Get profile by user id
//Public

router.get('/user/:user_id', async (req, res) => {
    try {
        //params user_id came from the url and path '/user/:user_id' on router.get
        const profile = await ProfileModel.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this user!' });
        }
        
        res.json(profile);
    } catch (err) {
        console.error(err.message);

        if(err.name==='CastError'){
            return res.status(400).json({ msg: 'There is no profile for this user!' });
        }
        res.status(500).send('Server Error!');
    }
})



//DLETE api/profile
//Delete profile user and posts
//Private
//This is the only route where we will use the UserModel
router.delete('/', auth, async (req, res) => {
    try {
        //todo - Remove user's posts
        await PostModel.deleteMany({ user: req.user.id });
        //Remove profile also the user: and _id are the fields on collections
        await ProfileModel.findOneAndRemove({ user: req.user.id });
        //Remove user
        await UserModel.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
})


//PUT api/profile/experience
//add profile experience
//Private

router.put('/experience', [ auth,[
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
] ], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title, company, location, from, to, current, description
    } = req.body;

    const newExp = { // this is same as doing title: title, company: company.... ES someting!
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await ProfileModel.findOne({ user: req.user.id });

        //We can use push but for unshift(to the beginning rather than the end);
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!')
    }
});



//DELETE api/profile/experience/:exp_id
//Delete experience from profile
//Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
 try {
     const profile = await ProfileModel.findOne({ user: req.user.id });

     //Get remove index for experience
     const removeIndex = profile.experience.map((item) => item.id).indexOf(req.params.exp_id);

     profile.experience.splice(removeIndex, 1);

     await profile.save();

     res.json(profile);
 } catch (err) {
     console.error(err.message);
     res.status(500).send('Server Error!');
 }
})


//PUT api/profile/education
//add profile education
//Private

router.put('/education', [ auth,[
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
] ], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        school, degree, fieldofstudy, from, to, current, description
    } = req.body;

    const newEdu = { // this is same as doing school: school, degree: degree.... ES someting!
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await ProfileModel.findOne({ user: req.user.id });

        //We can use push but for unshift(to the beginning rather than the end);
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!')
    }
});



//DELETE api/profile/education/:edu_id
//Delete education from profile
//Private

router.delete('/education/:edu_id', auth, async (req, res) => {
 try {
     const profile = await ProfileModel.findOne({ user: req.user.id });

     //Get remove index for education
     const removeIndex = profile.education.map((item) => item.id).indexOf(req.params.edu_id);

     profile.education.splice(removeIndex, 1);

     await profile.save();

     res.json(profile);
 } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error!');
 }
});



//GET api/profile/github/:username
//Get user repos from Github
//Public

router.get('/github/:username', async (req, res) => {
    try {
        const uri = encodeURI(
            `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
            );
            const headers = {
                'user-agent': 'node.js',
                Authorization: `token ${process.env.githubToken}`
            };

            const githubres = await axios.get(uri, { headers });

            return res.json(githubres.data);

    } catch (err) {
        console.log(process.env.githubSecret)
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
})

module.exports = router;