const express = require('express');
const fileSystem = require('fs');
const cors = require('cors');
const path = require('path');
require ('dotenv').config()

const {PORT, BACKEND_URL} = process.env;
const app = express();

//middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let videos = require('./data/videos.json');

app.get('/', (req, res) => {
    res.send('Server is running');
  });

app.get('/videos', (req, res) => {
    const videoInfo = videos.map(video => ({
        id: video.id,
        title: video.title,
        image: video.image,
        channel: video.channel
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
    console.log('POST request received at /videos');
    console.log('Request body:', req.body);

    const newVideo = {
        id: Date.now().toString(),
        title: req.body.title,
        description: req.body.description,
        image: 'http://localhost:8080/images/default-thumbnail.jpg',
        views: 0,
        likes: 0,
        timestamp: Date.now(),
        channel: "author name",
        duration: "0.00",
        video:  "",
        comments: []
    };
    videos.push(newVideo);
    fileSystem.writeFileSync(path.join(__dirname, 'data', 'videos.json'), JSON.stringify(videos, null, 2));
    res.status(201).json(newVideo);
});

app.listen(PORT, () => {
    console.log(`Server is running on ${BACKEND_URL}:${PORT}`);
});