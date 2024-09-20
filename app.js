const playPauseButton = document.getElementById('play-pause');
const progressBar = document.getElementById('progress');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const albumCover = document.getElementById('album-cover');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const volumeSlider = document.getElementById('volume-slider');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// รายการเพลง
const playlist = [
    {
        src: '/playlist/S.mp3',
        title: 'เหมือนวิวาห์',
        artist: 'Jeff Satur',
        cover: 'https://cdn.pixabay.com/photo/2021/11/05/19/30/animal-6771900_640.jpg'
    },
    {
        src: '/playlist/A.mp3',
        title: 'KRYPTONITE',
        artist: 'PUN',
        cover: 'https://cdn.pixabay.com/photo/2023/09/06/02/21/ice-8236115_640.jpg'
    },
    {
        src: '/playlist/X.mp3',
        title: 'Say Yes To Heaven',
        artist: 'Lana Del Rey',
        cover: 'https://cdn.pixabay.com/photo/2019/12/17/17/35/leaves-4702127_1280.jpg'
    },
    {
        src: '/playlist/M.mp3',
        title: 'หมอนอิง',
        artist: 'NuNew',
        cover: 'https://cdn.pixabay.com/photo/2017/08/01/16/50/pillow-2566613_1280.jpg'
    },
];

let currentSongIndex = 0;
let isPlaying = false;
let audio = new Audio(playlist[currentSongIndex].src);

// ฟังก์ชันโหลดเพลง
function loadSong(index) {
    const song = playlist[index];
    audio.src = song.src;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    albumCover.src = song.cover;
    audio.load();
    if (isPlaying) playSong();
}

// เริ่มเพลง
async function playSong() {
    try {
        await audio.play();
        playPauseButton.querySelector('i').classList.remove('fa-play');
        playPauseButton.querySelector('i').classList.add('fa-pause');
        isPlaying = true;
        console.log('เพลงกำลังเล่น');
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการเล่นเพลง:', error);
    }
}

// หยุดเพลง
function pauseSong() {
    audio.pause();
    playPauseButton.querySelector('i').classList.remove('fa-pause');
    playPauseButton.querySelector('i').classList.add('fa-play');
    isPlaying = false;
    console.log('เพลงถูกหยุด');
}

// ควบคุมการเล่นเพลง
playPauseButton.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

// อัปเดตแถบความก้าวหน้าเมื่อเพลงเล่น
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        updateProgress();
    }
});

// ปรับเวลาของเพลงตามแถบความก้าวหน้า
progressBar.addEventListener('input', (event) => {
    const value = event.target.value;
    audio.currentTime = (value / 100) * audio.duration;
});

// ฟังก์ชันอัปเดตเวลา
function updateTime() {
    const currentMinutes = Math.floor(audio.currentTime / 60);
    const currentSeconds = Math.floor(audio.currentTime % 60);
    const durationMinutes = Math.floor(audio.duration / 60);
    const durationSeconds = Math.floor(audio.duration % 60);

    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
    durationEl.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
}

// อัปเดตแถบความก้าวหน้าของโปรเกรสบาร์
function updateProgress() {
    const value = progressBar.value;
    const percentage = (value / 100) * 100;
    progressBar.style.background = `linear-gradient(to right, #a855f7 ${percentage}%, #4b5563 ${percentage}%)`;
}

// อัปเดตเวลาเมื่อเพลงเล่น
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        updateProgress();
        updateTime();
    }
});

// เปลี่ยนเพลงก่อนหน้า
prevButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
});

// เปลี่ยนเพลงถัดไป
nextButton.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
});

// ฟังก์ชันปรับระดับเสียง
volumeSlider.addEventListener('input', (event) => {
    audio.volume = event.target.value;
});

// โหลดเพลงเริ่มต้น
loadSong(currentSongIndex);

// เพิ่มการจัดการเมื่อเพลงสิ้นสุด
audio.addEventListener('ended', () => {
    nextButton.click();
});

// จัดการข้อผิดพลาดเมื่อโหลดเพลงล้มเหลว
audio.addEventListener('error', (e) => {
    console.error('เกิดข้อผิดพลาดในการโหลดเพลง:', e);
});
