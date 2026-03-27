document.addEventListener('DOMContentLoaded', () => {
    const playPauseBtn = document.getElementById('play-pause');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const progressBar = document.getElementById('progress');
    const volumeBar = document.getElementById('volume-control');
    const currTimeEl = document.getElementById('curr-time');
    const totTimeEl = document.getElementById('tot-time');
    const currentCover = document.getElementById('current-cover');
    const currentTitle = document.getElementById('current-title');
    const currentArtist = document.getElementById('current-artist');
    const songsContainer = document.getElementById('songs-container');

    let songs = [];
    let currentSongIndex = 0;
    let audio = new Audio();
    let isPlaying = false;

    // Fetch songs from API
    async function fetchSongs() {
        try {
            const res = await fetch('/api/songs');
            songs = await res.json();
            renderSongs();
            if (songs.length > 0) {
                loadSong(0, false);
            }
        } catch (error) {
            console.error('Error fetching songs:', error);
            songsContainer.innerHTML = '<p style="color:red; text-align:center;">Failed to load songs.</p>';
        }
    }

    // Render song cards
    function renderSongs() {
        songsContainer.innerHTML = '';
        songs.forEach((song, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${song.image}" alt="Cover">
                <div class="play-hover-btn" data-index="${index}">
                    <i class="fa-solid fa-play" style="pointer-events:none;"></i>
                </div>
                <div class="card-title">${song.title}</div>
                <div class="card-info">${song.description}</div>
            `;
            
            // Double click card to play
            card.addEventListener('dblclick', () => {
                loadSong(index, true);
            });

            // Click play button to play
            const playHoverBtn = card.querySelector('.play-hover-btn');
            playHoverBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentSongIndex === index && isPlaying) {
                    pauseSong();
                } else {
                    loadSong(index, true);
                }
            });

            songsContainer.appendChild(card);
        });
        updatePlayButtonsState();
    }

    function loadSong(index, play = false) {
        currentSongIndex = index;
        const song = songs[currentSongIndex];
        audio.src = song.audio;
        currentCover.src = song.image;
        currentTitle.textContent = song.title;
        currentArtist.textContent = song.description || 'Unknown Artist';
        
        if (play) {
            playSong();
        } else {
            // Reset player visual state
            progressBar.value = 0;
            currTimeEl.textContent = '0:00';
            totTimeEl.textContent = '0:00';
            pauseSong(); // Ensure visuals match
        }
        updatePlayButtonsState();
    }

    function playSong() {
        audio.play().catch(e => console.error("Playback prevented:", e));
        isPlaying = true;
        playPauseBtn.classList.remove('fa-circle-play');
        playPauseBtn.classList.add('fa-circle-pause');
        updatePlayButtonsState();
    }

    function pauseSong() {
        audio.pause();
        isPlaying = false;
        playPauseBtn.classList.remove('fa-circle-pause');
        playPauseBtn.classList.add('fa-circle-play');
        updatePlayButtonsState();
    }

    function updatePlayButtonsState() {
        // Update all card hover buttons
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, idx) => {
            const icon = card.querySelector('.play-hover-btn i');
            if (idx === currentSongIndex && isPlaying) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            } else {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
    }

    // Controls
    playPauseBtn.addEventListener('click', () => {
        if (!songs.length) return;
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (!songs.length) return;
        let nextIndex = currentSongIndex + 1;
        if (nextIndex >= songs.length) nextIndex = 0;
        loadSong(nextIndex, true);
    });

    prevBtn.addEventListener('click', () => {
        if (!songs.length) return;
        let prevIndex = currentSongIndex - 1;
        if (prevIndex < 0) prevIndex = songs.length - 1;
        loadSong(prevIndex, true);
    });

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const current = audio.currentTime;
            const duration = audio.duration;
            progressBar.value = (current / duration) * 100;
            
            currTimeEl.textContent = formatTime(current);
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        totTimeEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
        nextBtn.click();
    });

    progressBar.addEventListener('input', (e) => {
        if (audio.duration) {
            const seekTime = (e.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        }
    });

    volumeBar.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Initialize
    fetchSongs();
    audio.volume = volumeBar.value / 100;
});