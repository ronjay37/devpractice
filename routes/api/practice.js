const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const ProfileModel = require("../../models/ProfileModel");

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await ProfileModel.findOne({
      user: req.user.id
    }).populate("user", ["name, avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "No profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error!");
  }
});

//DELETE api/posts/comment/:post_id/:comment_id
//Delete a comment
//Private

router.delete("/comment/:post_id/:comment_id", auth, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.post_id);

    //Pull out comment
    //find method, this actually takes foreach, map, filter
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    //Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist!" });
    }

    //Check logged in user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized!" });
    }

    //Get remove index
    // const removeIndex = post.comments
    //   .map((comment) => comment.user.toString())
    //   .indexOf(req.user.id);

    // post.comments.splice(removeIndex, 1);

    // post.comments.filter((comment) => comment.id !== req.params.comment_id);

    // await post.save();
    await comment.remove();

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});
