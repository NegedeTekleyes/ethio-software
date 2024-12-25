const express = require('express');
const Comment = require('../model/comment.model');




const router = express.Router();

//  create a comment
router.post("/post-comment", async (req, res) => {
    try {
         console.log(req.body);
    const newComment = new Comment(req.body);
    await newComment.save();
    res.status(200).send({message: "Comment created successfully", comment: newComment})


    } catch (error) {
        console.error("An error occurred while posting new comment", error);
        res.status(500).send({message: "An error occurred while posting new comment"})

    }
})

// Get All comments count
router.get("/total-comment", async (req, res) => {
    try {
        const totalComment = await Comment.countDocuments({});
        res.status(200).send({message: "Total comments count", totalComment})

    } catch (error) {
        console.error("An error occurred while getting comment count", error);
        res.status(500).send({message: "An error occurred while getting comment count"})


    }
})



module.exports = router;