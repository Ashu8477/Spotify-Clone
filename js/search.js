





const searchInput = document.getElementById('searchInput');

let debounceTimer = null;





function initializeSearch() {
  if (!searchInput) return;

  searchInput.addEventListener('input', handleSearchInput);

  searchInput.addEventListener('keydown', handleKeyDown);
}





function handleSearchInput(e) {
  const keyword = e.target.value.trim();

  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    performSearch(keyword);
  }, 400);
}





async function performSearch(query) {
  if (!query) {
    updateSectionTitle('Trending Songs');

    renderTrendingSongs(trendingSongs);

    return;
  }

  try {
    toggleLoading(true);

    const songs = await fetchSearch(query);

    currentSongs = songs;

    renderTrendingSongs(songs);

    updateSectionTitle(`Search : ${query}`);

    toggleLoading(false);
  } catch (error) {
    console.error(error);

    showToast('Search Failed');

    toggleLoading(false);
  }
}





function handleKeyDown(e) {
  if (e.key === 'Escape') {
    clearSearch();
  }

  if (e.key === 'Enter') {
    performSearch(searchInput.value.trim());
  }
}





async function searchArtist(name) {
  if (!name) return;

  try {
    toggleLoading(true);

    const songs = await fetchArtist(name);

    currentSongs = songs;

    renderTrendingSongs(songs);

    updateSectionTitle(name);

    scrollToTop();

    toggleLoading(false);
  } catch (err) {
    console.error(err);

    toggleLoading(false);
  }
}





function startVoiceSearch() {
  if (!('webkitSpeechRecognition' in window)) {
    showToast('Voice Search Not Supported');

    return;
  }

  const recognition = new webkitSpeechRecognition();

  recognition.lang = 'en-US';

  recognition.start();

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript;

    searchInput.value = text;

    performSearch(text);
  };
}





function highlight(text, keyword) {
  if (!keyword) return text;

  const regex = new RegExp(
    `(${keyword})`,

    'gi'
  );

  return text.replace(
    regex,

    '<mark>$1</mark>'
  );
}





function resetSearch() {
  searchInput.value = '';

  updateSectionTitle('Trending Songs');

  renderTrendingSongs(trendingSongs);
}





function saveRecentSearch(query) {
  if (!query) return;

  let searches = JSON.parse(localStorage.getItem('recent_searches') || '[]');

  searches = searches.filter((item) => item !== query);

  searches.unshift(query);

  if (searches.length > 10) {
    searches.pop();
  }

  localStorage.setItem(
    'recent_searches',

    JSON.stringify(searches)
  );
}





function getRecentSearches() {
  return JSON.parse(localStorage.getItem('recent_searches') || '[]');
}





window.searchModule = {
  initializeSearch,

  performSearch,

  searchArtist,

  startVoiceSearch,

  resetSearch,

  saveRecentSearch,

  getRecentSearches,
};
