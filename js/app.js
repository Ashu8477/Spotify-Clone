




document.addEventListener('DOMContentLoaded', initApp);


let trendingSongs = [];
let searchResults = [];
let currentSongs = [];





async function initApp() {
  showLoader();

  loadTheme();

  registerEvents();

  await loadTrendingSongs();

  loadRecentSongs();

  loadLikedSongs();

  const artists = await fetchPopularArtists();
  renderArtists(artists);

  hideLoader();
}





function registerEvents() {
  
  const searchInput = document.getElementById('searchInput');

  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  
  const themeBtn = document.getElementById('themeBtn');

  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  

  document.getElementById('playBtn')?.addEventListener('click', togglePlay);

  document.getElementById('nextBtn')?.addEventListener('click', nextSong);

  document.getElementById('prevBtn')?.addEventListener('click', previousSong);

  document
    .getElementById('shuffleBtn')
    ?.addEventListener('click', shuffleSongs);

  document.getElementById('repeatBtn')?.addEventListener('click', toggleRepeat);

  document.getElementById('volumeBar')?.addEventListener('input', changeVolume);

  document.getElementById('progressBar')?.addEventListener('input', seekSong);
  
  document.getElementById('homeBtn')?.addEventListener('click', (e) => {
    e.preventDefault();

    renderTrendingSongs(trendingSongs);
    loadRecentSongs();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
  });

  document.getElementById('discoverBtn')?.addEventListener('click', (e) => {
    e.preventDefault();

    document.getElementById('searchInput').focus();
  });

  document.getElementById('likedBtn')?.addEventListener('click', (e) => {
    e.preventDefault();

    if (typeof getLikedSongs === 'function') {
      renderTrendingSongs(getLikedSongs());
    }
  });

  document.getElementById('recentBtn')?.addEventListener('click', (e) => {
    e.preventDefault();

    if (typeof getRecentSongs === 'function') {
      renderTrendingSongs(getRecentSongs());
    }
  });

  document.getElementById('playlistBtn')?.addEventListener('click', (e) => {
    e.preventDefault();

    showToast('Playlist feature coming soon...');
  });
}





async function loadTrendingSongs() {
  try {
    trendingSongs = await fetchTrending();

    currentSongs = [...trendingSongs];

    renderTrendingSongs(trendingSongs);
  } catch (err) {
    console.error(err);

    showToast('Unable to load songs.');
  }
}





async function handleSearch(e) {
  const keyword = e.target.value.trim();

  if (!keyword) {
    renderTrendingSongs(trendingSongs);

    return;
  }

  searchResults = await fetchSearch(keyword);

  renderTrendingSongs(searchResults);
}





function toggleTheme() {
  document.body.classList.toggle('light-theme');

  localStorage.setItem(
    'theme',

    document.body.classList.contains('light-theme')
  );
}





function loadTheme() {
  const theme = localStorage.getItem('theme');

  if (theme === 'true') {
    document.body.classList.add('light-theme');
  }
}





function loadRecentSongs() {
  if (typeof getRecentSongs !== 'function') return;

  const recent = getRecentSongs();

  renderRecentSongs(recent);
}





function loadLikedSongs() {
  if (typeof getLikedSongs !== 'function') return;

  getLikedSongs();
}





function showLoader() {
  const container = document.getElementById('trendingSongs');

  if (!container) return;

  container.innerHTML = `

        <div class="loader"></div>

    `;
}

function hideLoader() {
  
}





function showToast(message) {
  let toast = document.querySelector('.toast');

  if (!toast) {
    toast = document.createElement('div');

    toast.className = 'toast';

    document.body.appendChild(toast);
  }

  toast.textContent = message;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}





function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}
