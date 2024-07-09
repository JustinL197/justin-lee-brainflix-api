const express = require('express');
const fileSystem = require('fs');
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.static('public'));

let videos = require('./data/videos.json');

app.get('/videos', (req, res) => {
    const videoInfo = videos.map(video => ({
        id: video.id,
        title: video.title,
        image: video.image
    }));
    res.json(videoInfo);
});

app.get('/videos/:id', (req, res) => {
    const video = videos.find(video => video.id === req.params.id);
    if (video){
        res.json(video);
    }else{
        res.status(404).send('Video not found');
    }
});

app.post('/videos', (req, res) => {
    const newVideo = {
        id: Date.now().toString(),
        title: req.body.title,
        description: req.body.description,
        image: '/public/images/defualt-thumbnail.jpg',
        views: 0,
        likes: 0,
        timestamp: Date.now()
    };
    videos.push(newVideo);
    fileSystem.writeFileSync('./data/videos.json', JSON.stringify(videos, null, 2));
    res.status(201).json(newVideo);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});