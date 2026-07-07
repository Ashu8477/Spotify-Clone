const CLIENT_ID = '949da4bc';

const BASE_URL = 'https://api.jamendo.com/v3.0/tracks/';

const DEFAULT_SEARCH = 'rock';


async function searchSongs(query) {
  try {
    const response = await fetch(
      `${BASE_URL}?client_id=${CLIENT_ID}&format=json&limit=20&search=${encodeURIComponent(
        query
      )}&audioformat=mp31`
    );

    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error('Search Error:', error);
    return [];
  }
}


async function getTrendingSongs() {
  try {
    const response = await fetch(
      `${BASE_URL}?client_id=${CLIENT_ID}&format=json&limit=20&order=popularity_total_desc&audioformat=mp31`
    );

    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}


async function getArtistSongs(artistName) {
  try {
    const response = await fetch(
      `${BASE_URL}?client_id=${CLIENT_ID}&format=json&limit=20&artist_name=${encodeURIComponent(
        artistName
      )}&audioformat=mp31`
    );

    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}


async function getAlbum(albumId) {
  try {
    const response = await fetch(
      `${BASE_URL}?client_id=${CLIENT_ID}&format=json&album_id=${albumId}&limit=20`
    );

    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}


async function getSong(songId) {
  try {
    const response = await fetch(
      `${BASE_URL}?client_id=${CLIENT_ID}&format=json&id=${songId}`
    );

    const data = await response.json();

    return data.results?.[0] || null;
  } catch (error) {
    console.error(error);
    return null;
  }
}


function formatDuration(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);

  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}


function mapSong(song) {
  return {
    id: song.id,
    title: song.name || 'Unknown Title',
    artist: song.artist_name || 'Unknown Artist',
    album: song.album_name || 'Single',
    cover:
      song.image ||
      song.album_image ||
      'https://placehold.co/300x300?text=No+Cover',
    preview: song.audio || '',
    duration: formatDuration(song.duration || 0),
  };
}


async function fetchTrending() {
  try {
    const songs = await getTrendingSongs();
    return songs.map(mapSong);
  } catch (err) {
    console.error(err);
    return [];
  }
}


async function fetchSearch(query) {
  try {
    const songs = await searchSongs(query || DEFAULT_SEARCH);
    return songs.map(mapSong);
  } catch (err) {
    console.error(err);
    return [];
  }
}


async function fetchArtist(artist) {
  try {
    const songs = await getArtistSongs(artist);
    return songs.map(mapSong);
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function fetchPopularArtists() {
  try {
    const songs = await getTrendingSongs();

    const artists = [];

    songs.forEach((song) => {
      if (!artists.find((a) => a.name === song.artist_name)) {
        artists.push({
          name: song.artist_name,
          image: song.image || song.album_image || 'images/default-cover.png',
        });
      }
    });

    return artists.slice(0, 10);
  } catch (err) {
    console.error(err);
    return [];
  }
}
