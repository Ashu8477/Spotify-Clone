




const STORAGE_KEYS = {
  LIKED: 'spotify_liked_songs',

  RECENT: 'spotify_recent_songs',

  PLAYLIST: 'spotify_playlist',

  THEME: 'spotify_theme',

  VOLUME: 'spotify_volume',
};





function save(key, value) {
  localStorage.setItem(
    key,

    JSON.stringify(value)
  );
}

function load(key, defaultValue = []) {
  const data = localStorage.getItem(key);

  return data ? JSON.parse(data) : defaultValue;
}





function getLikedSongs() {
  return load(STORAGE_KEYS.LIKED);
}

function saveLikedSong(song) {
  let liked = getLikedSongs();

  const exists = liked.find((item) => item.id === song.id);

  if (exists) {
    showToast('Already Liked');

    return;
  }

  liked.unshift(song);

  save(STORAGE_KEYS.LIKED, liked);

  showToast('Added to Liked Songs');
}

function removeLikedSong(id) {
  const liked = getLikedSongs().filter((song) => song.id !== id);

  save(STORAGE_KEYS.LIKED, liked);
}





function getRecentSongs() {
  return load(STORAGE_KEYS.RECENT);
}

function saveRecentSong(song) {
  let recent = getRecentSongs();

  recent = recent.filter((item) => item.id !== song.id);

  recent.unshift(song);

  if (recent.length > 10) {
    recent.pop();
  }

  save(STORAGE_KEYS.RECENT, recent);
}





function getPlaylist() {
  return load(STORAGE_KEYS.PLAYLIST);
}

function savePlaylist(list) {
  save(
    STORAGE_KEYS.PLAYLIST,

    list
  );
}

function clearPlaylist() {
  save(
    STORAGE_KEYS.PLAYLIST,

    []
  );
}





function saveTheme(isLight) {
  localStorage.setItem(
    STORAGE_KEYS.THEME,

    isLight
  );
}

function getTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME);
}





function saveVolume(volume) {
  localStorage.setItem(
    STORAGE_KEYS.VOLUME,

    volume
  );
}

function getVolume() {
  return Number(localStorage.getItem(STORAGE_KEYS.VOLUME) || 100);
}





function clearStorage() {
  localStorage.removeItem(STORAGE_KEYS.LIKED);

  localStorage.removeItem(STORAGE_KEYS.RECENT);

  localStorage.removeItem(STORAGE_KEYS.PLAYLIST);

  localStorage.removeItem(STORAGE_KEYS.THEME);

  localStorage.removeItem(STORAGE_KEYS.VOLUME);
}





function getStorageStats() {
  return {
    liked: getLikedSongs().length,

    recent: getRecentSongs().length,

    playlist: getPlaylist().length,
  };
}





window.storage = {
  getLikedSongs,

  saveLikedSong,

  removeLikedSong,

  getRecentSongs,

  saveRecentSong,

  getPlaylist,

  savePlaylist,

  clearPlaylist,

  saveTheme,

  getTheme,

  saveVolume,

  getVolume,

  clearStorage,

  getStorageStats,
};
