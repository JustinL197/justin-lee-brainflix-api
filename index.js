const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const videoRoute = require('./routes/videos');

require ('dotenv').config()

const {PORT, BACKEND_URL} = process.env;
const app = express();

//middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/videos', videoRoute);

const videosFilePath = path.join(__dirname, 'data/videos.json');

const readVideoData = () => {
    const videosData = fs.readFileSync(videosFilePath);
    return JSON.parse(videosData);
};

app.get('/', (req, res) => {
    res.send('Server is running');
  });

app.get('/videos', (req, res) => {
    const videoData = readVideoData();
    const videoInfo = videoData.map(video => ({
        id: video.id,
        title: video.title,
        image: video.image,
        channel: video.channel
    }));
    res.json(videoInfo);
});

app.get('/videos/:id', (req, res) => {
    const videoData = readVideoData();
    const video = videoData.find(video => video.id === req.params.id);
    if (video){
        res.json(video);
    }else{
        res.status(404).send('Video not found');
    }
});

app.post('/videos', (req, res) => {
    const videoData = readVideoData();
    
    const newVideo = {
        id: Date.now().toString(),
        title: req.body.title,
        description: req.body.description,
        image: 'http://localhost:8080/images/default-thumbnail.jpg',
        views: 0,
        likes: 0,
        timestamp: Date.now(),
        channel: "Anonymous",
        duration: "0.00",
        video:  "",
        comments: []
    };
    videoData.push(newVideo);
    fs.writeFileSync(path.join(__dirname, 'data', 'videos.json'), JSON.stringify(videoData, null, 2));
    res.status(201).json(newVideo);
});
    

app.listen(PORT, () => {
    console.log(`Server is running on ${BACKEND_URL}:${PORT}`);
});