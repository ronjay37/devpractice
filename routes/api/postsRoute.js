const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/authMiddleware');

const PostModel = require('../../models/PostModel');
const UserModel = require('../../models/UserModel');
//const ProfileModel = require('../../models/ProfileModel');


//POST api/posts
//Create a post
//Private
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
   
    try {

        const user = await UserModel.findById(req.user.id).select('-password');

        const newPost = new PostModel ({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();
        res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }

})


//GET api/posts
//Get all posts
//Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ date: -1 }) // -1 is for recent, that's what will show first, 1 is the default
        res.json(posts)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
})



//GET api/posts/:id
//Get post by id
//Private

router.get('/:id', auth, async (req, res) => {
    try {

        const post = await PostModel.findById(req.params.id);

        if(!post) {
            return res.status(404).json({ msg: 'Post not found!' });
        }

        res.json(post)
    } catch (err) {
        console.error(err.message);
        if(err.name==='CastError') {
            return res.status(404).json({ msg: 'Post not found!' });
        }
        res.status(500).send('Server Error!');
    }
})



//DELETE api/posts/:id
//Delete a post
//Private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Profile not found!' });
        }

        //Check on user
        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized!' });
        }

        await post.remove();
        res.json({ msg: 'Post removed!' })
    } catch (err) {
        console.error(err.message);
        if(err.name==='CastError') {
            return res.status(404).json({ msg: 'Post not found!' });
        }
        res.status(500).send('Server Error!');
    }
})


//PUT api/posts/like/:id
//Like a post
//Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        
        const post = await PostModel.findById(req.params.id);

        //Check if post has already been liked
        if(post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post has already been liked!' })
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
})


//PUT api/posts/unlike/:id
//UNlike a post
//Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        
        const post = await PostModel.findById(req.params.id);

        //Check if post has already been liked
        if(post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not yet been liked!' });
        }

        //Get remove index
        const removeIndex = post.likes.map((like) => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});


//POST api/posts/comment:id
//Comment on a post
//Private
router.post('/comment/:id', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
   
    try {

        const user = await UserModel.findById(req.user.id).select('-password');

        const post = await PostModel.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };

        post.comments.unshift(newComment);

        await post.save();
        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }

});



//DELETE api/posts/comment/:post_id/:comment_id
//Delete a comment
//Private

router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.post_id);

        //Pull out comment
        //find method, this actually takes foreach, map, filter
        const comment = post.comments.find((comment) => comment.id === req.params.comment_id);

        //Make sure comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist!' })
        }

        //Check logged in user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized!' })
        }


        //Get remove index
        const removeIndex = post.comments.map((comment) => comment.user.toString()).indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!')
    }
})

module.exports = router;