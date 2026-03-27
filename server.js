const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
const songsFile = path.join(dataDir, 'songs.json');

if (!fs.existsSync(songsFile)) {
    fs.writeFileSync(songsFile, JSON.stringify([], null, 2));
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'audio') {
            cb(null, path.join(__dirname, 'music'));
        } else if (file.fieldname === 'image') {
            cb(null, path.join(__dirname, 'img'));
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get('/api/songs', (req, res) => {
    fs.readFile(songsFile, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read songs' });
        res.json(JSON.parse(data));
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '1234') {
        res.json({ success: true, token: 'admin-token-1234' });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

app.post('/api/songs', upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'image', maxCount: 1 }]), (req, res) => {
    const { title, description } = req.body;
    
    if (!req.files['audio'] || !req.files['image']) {
        return res.status(400).json({ error: 'Audio and image files are required' });
    }

    const audioPath = '/music/' + req.files['audio'][0].filename;
    const imagePath = '/img/' + req.files['image'][0].filename;

    const newSong = {
        id: Date.now().toString(),
        title: title || 'Unknown Title',
        description: description || 'Unknown Description',
        audio: audioPath,
        image: imagePath
    };

    fs.readFile(songsFile, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read songs' });
        let songs = JSON.parse(data);
        songs.push(newSong);
        fs.writeFile(songsFile, JSON.stringify(songs, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Failed to save song' });
            res.json(newSong);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
