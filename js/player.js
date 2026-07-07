








const audio = document.getElementById('audioPlayer');

let currentSongIndex = 0;
let isPlaying = false;
let isRepeat = false;
let isShuffle = false;

let currentPlaylist = [];

function setPlaylist(songs) {
  currentPlaylist = Array.isArray(songs) ? songs : [];
}

function loadSong(index) {
  if (!currentPlaylist.length) return;

  currentSongIndex = index;
  if (index < 0 || index >= currentPlaylist.length) return;

  const song = currentPlaylist[index];

  if (!song || !song.preview) {
    showToast('Audio preview not available.');
    return;
  }

  audio.pause();
  audio.currentTime = 0;

  audio.src = song.preview;
  audio.load();

  updatePlayerUI(song);
}

function updatePlayerUI(song) {
  const title = document.getElementById('songTitle');
  const artist = document.getElementById('artistName');
  const cover = document.getElementById('coverImage');

  if (cover) {
    cover.classList.remove('playing');
    void cover.offsetWidth; 
    cover.classList.add('playing');
  }

  if (title) title.textContent = song.title;
  if (artist) artist.textContent = song.artist;
  if (cover) cover.src = song.cover;
  document.querySelector('.song-info').classList.add('fade');

  setTimeout(() => {
    document.querySelector('.song-info').classList.remove('fade');
  }, 300);
}
async function playSong(index = null) {
  try {
    if (index !== null) {
      loadSong(index);
    }
    if (!audio.src) {
      showToast('No song selected.');
      return;
    }
    await audio.play();
    isPlaying = true;
    updatePlayButton();
  } catch (error) {
    showToast('Unable to play this song.');
    console.error('Play Error :', error);
  }
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  updatePlayButton();
}

function togglePlay() {
  if (!currentPlaylist.length) return;
  if (!audio.src) {
    loadSong(currentSongIndex);
  }
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

function updatePlayButton() {
  const btn = document.getElementById('playBtn');
  if (!btn) return;
  btn.innerHTML = isPlaying
    ? '<i class="fa-solid fa-pause"></i>'
    : '<i class="fa-solid fa-play"></i>';
}

audio.addEventListener('play', () => {
  isPlaying = true;
  updatePlayButton();
});

audio.addEventListener('pause', () => {
  isPlaying = false;
  updatePlayButton();
});

audio.addEventListener('loadedmetadata', () => {
  const duration = document.getElementById('duration');

  if (duration) {
    duration.textContent = formatTime(audio.duration);
  }
});

function formatTime(time) {
  if (isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

window.player = {
  playSong,
  pauseSong,
  togglePlay,
  loadSong,
  setPlaylist,
};

function nextSong() {
  if (!currentPlaylist.length) return;
  if (isShuffle) {
    playRandomSong();
    return;
  }
  currentSongIndex++;
  if (currentSongIndex >= currentPlaylist.length) {
    currentSongIndex = 0;
  }
  playSong(currentSongIndex);
}

function previousSong() {
  if (!currentPlaylist.length) return;
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = currentPlaylist.length - 1;
  }
  playSong(currentSongIndex);
}

function shuffleSongs() {
  isShuffle = !isShuffle;
  const btn = document.getElementById('shuffleBtn');
  if (!btn) return;
  if (isShuffle) {
    btn.style.color = '#1DB954';
    showToast('Shuffle Enabled');
  } else {
    btn.style.color = '#ffffff';
    showToast('Shuffle Disabled');
  }
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  const btn = document.getElementById('repeatBtn');
  if (!btn) return;
  if (isRepeat) {
    btn.style.color = '#1DB954';
    showToast('Repeat Enabled');
  } else {
    btn.style.color = '#ffffff';
    showToast('Repeat Disabled');
  }
}

function playRandomSong() {
  if (!currentPlaylist.length) return;
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * currentPlaylist.length);
  } while (currentPlaylist.length > 1 && randomIndex === currentSongIndex);
  currentSongIndex = randomIndex;
  playSong(currentSongIndex);
}

audio.addEventListener('ended', () => {
  if (isRepeat) {
    playSong(currentSongIndex);
    return;
  }
  if (isShuffle) {
    playRandomSong();
    return;
  }
  nextSong();
});

function selectSong(index) {
  if (!currentPlaylist.length) return;
  currentSongIndex = index;
  playSong(index);
}

function getCurrentSong() {
  if (!currentPlaylist.length) return null;
  return currentPlaylist[currentSongIndex];
}

function getCurrentSongIndex() {
  return currentSongIndex;
}

window.player = {
  ...window.player,
  nextSong,
  previousSong,
  shuffleSongs,
  toggleRepeat,
  playRandomSong,
  selectSong,
  getCurrentSong,
  getCurrentSongIndex,
};

audio.addEventListener('timeupdate', updateProgress);

function updateProgress() {
  if (!audio.duration) return;
  const progressBar = document.getElementById('progressBar');
  const currentTime = document.getElementById('currentTime');
  const progress = (audio.currentTime / audio.duration) * 100;
  if (progressBar) {
    progressBar.value = progress;
  }
  progressBar.style.background = `linear-gradient(to right,#1DB954 ${progress}%,#555 ${progress}%)`;

  if (currentTime) {
    currentTime.textContent = formatTime(audio.currentTime);
  }
}

function seekSong(e) {
  if (!audio.duration) return;
  const value = e.target.value;
  audio.currentTime = (value / 100) * audio.duration;
}

function changeVolume(e) {
  audio.volume = Math.max(0, Math.min(1, e.target.value / 100));
}

audio.volume = 1;

let previousVolume = 1;

function toggleMute() {
  const volumeBar = document.getElementById('volumeBar');
  if (audio.volume > 0) {
    previousVolume = audio.volume;
    audio.volume = 0;
    if (volumeBar) {
      volumeBar.value = 0;
    }
    showToast('Muted');
  } else {
    audio.volume = previousVolume;
    if (volumeBar) {
      volumeBar.value = previousVolume * 100;
    }
    showToast('Unmuted');
  }
}

document.getElementById('coverImage')?.addEventListener('dblclick', toggleMute);

document.addEventListener('keydown', (e) => {
  const tag = document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  switch (e.code) {
    case 'Space':
      e.preventDefault();
      togglePlay();
      break;
    case 'ArrowRight':
      audio.currentTime += 10;
      break;
    case 'ArrowLeft':
      audio.currentTime -= 10;
      break;
    case 'ArrowUp':
      audio.volume = Math.min(1, audio.volume + 0.1);
      const volumeBar = document.getElementById('volumeBar');
      if (volumeBar) {
        volumeBar.value = audio.volume * 100;
      }
      break;
    case 'ArrowDown':
      audio.volume = Math.max(0, audio.volume - 0.1);

      const volumeBarDown = document.getElementById('volumeBar');
      if (volumeBarDown) {
        volumeBarDown.value = audio.volume * 100;
      }

      break;
    case 'KeyM':
      toggleMute();
      break;
    case 'KeyN':
      nextSong();
      break;
    case 'KeyP':
      previousSong();
      break;
  }
});

audio.addEventListener('play', () => {
  if (!currentPlaylist.length) return;
  const song = currentPlaylist[currentSongIndex];
  if (typeof saveRecentSong === 'function') {
    saveRecentSong(song);
  }
});
if (typeof loadRecentSongs === 'function') {
  loadRecentSongs();
}

audio.addEventListener('error', () => {
  console.error(audio.error);

  showToast('Skipping unavailable song...');

  nextSong();
});

audio.addEventListener('waiting', () => {
  document.getElementById('playBtn')?.classList.add('loading');
});

audio.addEventListener('playing', () => {
  document.getElementById('playBtn')?.classList.remove('loading');
});

window.addEventListener('focus', () => {
  if (isPlaying && audio.src) {
    audio.play().catch(() => {});
  }
});

window.player = {
  ...window.player,
  seekSong,
  changeVolume,
  toggleMute,
  updateProgress,
};
