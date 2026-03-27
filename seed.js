const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
const songsFile = path.join(dataDir, 'songs.json');

// Using a public domain classical Indian audio as a placeholder for full songs
const FULL_SONG_URL = 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Bairagi_Bhairav.ogg';
const COVER_URL = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400';

const indianTitles = [
  "Tum Hi Ho", "Channa Mereya", "Kal Ho Naa Ho", "Kabira", "Gerua", 
  "Ae Dil Hai Mushkil", "Teri Mitti", "Agar Tum Saath Ho", "Raabta", "Samjhawan",
  "Pee Loon", "Tujh Mein Rab Dikhta Hai", "Tera Ban Jaunga", "Shayad", "Khairiyat",
  "Tujhe Kitna Chahne Lage", "Hawayein", "Zaalima", "Enna Sona", "Bekhayali",
  "Kaun Tujhe", "Dil Diyan Gallan", "Ghungroo", "Ilahi", "Subhanallah",
  "Iktara", "Zara Sa", "Jashn-E-Bahaara", "Kun Faya Kun", "Phir Le Aya Dil"
];

function seedSongs() {
    try {
        console.log('Generating 30 Full-Length Indian tracks...');
        
        const songs = indianTitles.map((title, index) => ({
            id: `seed-${Date.now()}-${index}`,
            title: title,
            description: "Arijit Singh / Pritam / A.R. Rahman",
            audio: FULL_SONG_URL,
            image: COVER_URL
        }));

        fs.writeFileSync(songsFile, JSON.stringify(songs, null, 2));
        console.log('Successfully seeded 30 full-length tracks to data/songs.json');
    } catch (error) {
        console.error('Error seeding songs:', error.message);
    }
}

seedSongs();
