


let playlist = window.playerPlaylist || [];


function initializePlaylist() {
  playlist = getPlaylist() || [];
}


function addToPlaylist(song) {
  if (!song) return;

  const exists = playlist.find((item) => item.id === song.id);

  if (exists) {
    showToast('Song already exists');

    return;
  }

  playlist.push(song);

  savePlaylist(playlist);

  showToast('Added to Playlist');
}


function removeFromPlaylist(id) {
  playlist = playlist.filter((song) => song.id !== id);

  savePlaylist(playlist);

  showToast('Removed from Playlist');
}


function clearCurrentPlaylist() {
  playlist = [];

  savePlaylist([]);

  showToast('Playlist Cleared');
}


function getCurrentPlaylist() {
  return playlist;
}


function playPlaylist() {
  if (!playlist.length) {
    showToast('Playlist Empty');

    return;
  }

  currentSongs = [...playlist];

  setPlaylist(currentSongs);

  playSong(0);
}


function shufflePlaylist() {
  if (playlist.length < 2) return;

  playlist.sort(() => Math.random() - 0.5);

  savePlaylist(playlist);

  showToast('Playlist Shuffled');
}


function searchPlaylist(query) {
  return playlist.filter(
    (song) =>
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase())
  );
}


function getPlaylistStats() {
  return {
    totalSongs: playlist.length,
  };
}


window.playlistManager = {
  initializePlaylist,

  addToPlaylist,

  removeFromPlaylist,

  clearCurrentPlaylist,

  getCurrentPlaylist,

  playPlaylist,

  shufflePlaylist,

  searchPlaylist,

  getPlaylistStats,
};
