const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const videosFilePath = path.join(__dirname, '../data/videos.json');

//function to read video data 
const readVideoData = () => {
    const videosData = fs.readFileSync(videosFilePath);
    return JSON.parse(videosData);
};

//function to write data to videos file
const writeVideoData = (data) => {
    fs.writeFileSync(videosFilePath, JSON.stringify(data, null, 2));
};

//handle post request
router.post('/:id/comments', (req, res) => {
    const videos = readVideoData();
    const video = videos.find(video => video.id === req.params.id);

    if (!video){
        return res.status(404).send({message: "video not found"});
    }

    const newComment = {
        id: Date.now().toString(),
        name: req.body.name,
        comment: req.body.comment,
        likes: 0,
        timestamp: Date.now()
    };

    video.comments.push(newComment);
    writeVideoData(videos);

    res.status(201).send(newComment);
});

//handle delete request
router.delete('/:id/comments/:commentId', (req, res) => {
    const videos = readVideoData();
    const video = videos.find(video => video.id === req.params.id);

    if (!video){
        return res.status(404).send({message: 'video not found'});
    };

    const findCommentIndex = video.comments.findIndex(comment => comment.id === req.params.commentId);

    if (findCommentIndex === -1){
        return res.status(404).send({message: 'comment not found'});
    };

    video.comments.splice(findCommentIndex, 1);
    writeVideoData(videos);

    res.status(200).send({message: 'comment deleted successfully'});
});

//handle put request
router.put('/:id/likes', (req, res) => {
    const videos = readVideoData();
    const video = videos.find(video => video.id === req.params.id);

    if (!video){
        return res.status(404).send({message: 'video not found'});
    }

    video.likes = parseInt(video.likes, 10) + 1;
    writeVideoData(videos);

    res.status(200).send({message: `like count incremented`, likes: video.likes})
});






module.exports = router;