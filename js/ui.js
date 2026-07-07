






const trendingContainer = document.getElementById('trendingSongs');





function renderTrendingSongs(songs = []) {
  if (!trendingContainer) return;

  if (!songs.length) {
    renderEmptyState();

    return;
  }

  trendingContainer.innerHTML = '';

  songs.forEach((song, index) => {
    const card = createSongCard(song, index);

    trendingContainer.appendChild(card);
  });
}





function createSongCard(song, index) {
  const card = document.createElement('div');

  card.className = 'song-card fade-in';

  card.innerHTML = `

        <div class="song-image">

            <img
                src="${song.cover}"
                alt="${song.title}"
                loading="lazy">

            <div class="overlay"></div>

            <div class="play-overlay">

                <i class="fa-solid fa-play"></i>

            </div>

        </div>

        <h3 class="song-title">

            ${song.title}

        </h3>

        <p class="song-artist">

            ${song.artist}

        </p>

        <div class="song-footer">

            <span class="song-duration">

                ${song.duration}

            </span>

            <i
                class="fa-regular fa-heart song-like"
                title="Like Song">
            </i>

        </div>

    `;

  
  card.querySelector('.play-overlay').addEventListener('click', (e) => {
    e.stopPropagation();

    if (typeof setPlaylist === 'function') {
      setPlaylist(currentSongs);
    }

    playSong(index);
  });

  
  card.querySelector('.song-like').addEventListener('click', (e) => {
    e.stopPropagation();

    toggleLikeSong(song, e.target);
  });

  
  card.addEventListener('click', () => {
    if (typeof setPlaylist === 'function') {
      setPlaylist(currentSongs);
    }

    playSong(index);
  });

  return card;
}





function toggleLikeSong(song, icon) {
  if (typeof saveLikedSong === 'function') {
    saveLikedSong(song);
  }

  icon.classList.remove('fa-regular');

  icon.classList.add('fa-solid');

  icon.style.color = '#1DB954';

  showToast('Added to Liked Songs');
}





function showLoader() {
  if (!trendingContainer) return;

  trendingContainer.innerHTML = '';

  for (let i = 0; i < 8; i++) {
    const skeleton = document.createElement('div');

    skeleton.className = 'song-card';

    skeleton.innerHTML = `

            <div
                style="
                width:100%;
                height:190px;
                background:#2b2b2b;
                border-radius:12px;
                margin-bottom:15px;
                animation:pulse 1.5s infinite;
                ">
            </div>

            <div
                style="
                height:18px;
                width:80%;
                background:#2b2b2b;
                border-radius:8px;
                margin-bottom:12px;
                animation:pulse 1.5s infinite;
                ">
            </div>

            <div
                style="
                height:14px;
                width:55%;
                background:#2b2b2b;
                border-radius:8px;
                animation:pulse 1.5s infinite;
                ">
            </div>

        `;

    trendingContainer.appendChild(skeleton);
  }
}





function hideLoader() {
  trendingContainer.innerHTML = '';
}





const pulseStyle = document.createElement('style');

pulseStyle.innerHTML = `

@keyframes pulse{

0%{

opacity:.4;

}

50%{

opacity:1;

}

100%{

opacity:.4;

}

}

`;

document.head.appendChild(pulseStyle);





window.ui = {
  renderTrendingSongs,

  createSongCard,

  showLoader,

  hideLoader,
};






const artistContainer =
    document.getElementById("artistContainer");

const recentContainer =
    document.getElementById("recentSongs");





function renderArtists(artists = []) {

    if (!artistContainer) return;

    if (!artists.length) {

        artistContainer.innerHTML = "";

        return;

    }

    artistContainer.innerHTML = "";

    artists.forEach((artist) => {

        const card = document.createElement("div");

        card.className = "artist-card fade-in";

        card.innerHTML = `

            <img
                src="${artist.picture || artist.image}"
                alt="${artist.name}"
                loading="lazy">

            <h3>${artist.name}</h3>

            <p>${artist.fans || 'Popular Artist'}</p>

        `;

        card.addEventListener("click", async () => {

            showLoader();

            const songs =
                await fetchArtist(artist.name);

            currentSongs = songs;

            renderTrendingSongs(songs);

            hideLoader();

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        });

        artistContainer.appendChild(card);

    });

}





function renderRecentSongs(songs = []) {

    if (!recentContainer) return;

    if (!songs.length) {

        recentContainer.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-clock"></i>

                <h3>No Recent Songs</h3>

                <p>

                    Play your first song to
                    see it here.

                </p>

            </div>

        `;

        return;

    }

    recentContainer.innerHTML = "";

    songs.forEach((song,index)=>{

        const card=document.createElement("div");

        card.className="recent-card fade-in";

        card.innerHTML=`

            <img
                src="${song.cover}"
                alt="${song.title}">

            <div class="recent-info">

                <h4>${song.title}</h4>

                <p>${song.artist}</p>

            </div>

            <div class="recent-play">

                <i class="fa-solid fa-play"></i>

            </div>

        `;

        card.addEventListener("click",()=>{

            currentSongs=songs;

            setPlaylist(currentSongs);

            playSong(index);

        });

        recentContainer.appendChild(card);

    });

}





function renderEmptyState(){

    if(!trendingContainer) return;

    trendingContainer.innerHTML=`

        <div class="empty-state">

            <i class="fa-solid fa-music"></i>

            <h3>

                No Songs Found

            </h3>

            <p>

                Try searching another
                artist or song.

            </p>

        </div>

    `;

}





function updateSectionTitle(title){

    const heading=document.querySelector(
        ".section-title h2"
    );

    if(heading){

        heading.textContent=title;

    }

}





function renderPlaylist(list=[]){

    if(!recentContainer) return;

    if(!list.length){

        renderRecentSongs([]);

        return;

    }

    recentContainer.innerHTML="";

    list.forEach((song,index)=>{

        const item=document.createElement("div");

        item.className="recent-card";

        item.innerHTML=`

            <img src="${song.cover}">

            <div class="recent-info">

                <h4>${song.title}</h4>

                <p>${song.artist}</p>

            </div>

            <div class="recent-play">

                <i class="fa-solid fa-play"></i>

            </div>

        `;

        item.addEventListener("click",()=>{

            currentSongs=list;

            setPlaylist(currentSongs);

            playSong(index);

        });

        recentContainer.appendChild(item);

    });

}





function clearSearch(){

    const input=document.getElementById(
        "searchInput"
    );

    if(input){

        input.value="";

    }

    updateSectionTitle("Trending Songs");

    renderTrendingSongs(trendingSongs);

}





window.ui={

    ...window.ui,

    renderArtists,

    renderRecentSongs,

    renderPlaylist,

    renderEmptyState,

    clearSearch,

    updateSectionTitle

};
