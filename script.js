console.log("Welcome to Spotify");

//Intialize the Variables
let songIndex=0;
let audioElement= new Audio('songs/1.mp3');
let masterPlay=document.getElementById('masterPlay');
let myProgressBar=document.getElementById('myProgressBar');
let gif=document.getElementById('gif');
let masterSongName=document.getElementById('masterSongName');
let songItems=Array.from(document.getElementsByClassName('song-item'));

let songs=[
    {songName:"Game Over - Karan Aujla" , filePath:"songs/1.mp3" , coverPath:"covers/1.jpg"},
    {songName:"Krish Rao - Cash Cash ", filePath:"songs/2.mp3" , coverPath:"covers/2.jpg"},
    {songName:"No Guts No Glory - ADDY NAGAR ", filePath:"songs/3.mp3" , coverPath:"covers/3.jpg"},
    {songName:"Never Mine - Harnoor", filePath:"songs/4.mp3" , coverPath:"covers/4.jpg"},
    {songName:"COURTSIDE - KARAN AUJLA", filePath:"songs/5.mp3" , coverPath:"covers/5.jpg"},
    {songName:"DIL DARDEH - NAVAAN SANDHU", filePath:"songs/6.mp3" , coverPath:"covers/6.jpg"},
    {songName:"Dont Look - Karan Aujla", filePath:"songs/7.mp3" , coverPath:"covers/7.jpg"},
    {songName:"HASEEN - TALWIINDER", filePath:"songs/8.mp3" , coverPath:"covers/8.jpg"},
    {songName:"HIGH ON YOU - Jind Universe", filePath:"songs/9.mp3" , coverPath:"covers/9.jpg"},
    {songName:"Signed To God - Sidhu Moose Wala", filePath:"songs/10.mp3" , coverPath:"covers/10.jpg"},
]
// Set initial song name on page load
masterSongName.innerText = songs[songIndex].songName;

songItems.forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
});

//audioElement.play()

masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.remove("fa-circle-play");
        masterPlay.classList.add("fa-pause");
        gif.style.opacity=1
    } else {
        audioElement.pause();
        masterPlay.classList.remove("fa-pause");
        masterPlay.classList.add("fa-circle-play");
        gif.style.opacity=0
    }
});


//listen to events
audioElement.addEventListener('timeupdate', ()=>{
    //update seekbar
    progress=parseInt((audioElement.currentTime/audioElement.duration)*100);
    myProgressBar.value=progress
})
// Jab user progress bar move kare, song ka current time change ho
myProgressBar.addEventListener('input', () => {
    audioElement.currentTime = (myProgressBar.value / 100) * audioElement.duration;
});


myProgressBar.addEventListener('change', ()=>{
    audioElement.currentTime=myProgressBar.value*audioElement.duration/100;
    

})

const makeAllPlays=()=>{
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{    
            element.classList.add('fa-circle-play');
            element.classList.remove('fa-pause');
    })
}

Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
    element.addEventListener('click',(e)=>{
        console.log(e.target);
        makeAllPlays();
        songIndex=parseInt(e.target.id)
        e.target.classList.remove('fa-circle-play');
        e.target.classList.add('fa-pause');
        audioElement.src=`songs/${songIndex+1}.mp3`;
        masterSongName.innerText=songs[songIndex].songName;
        audioElement.play();
        gif.style.opacity=1
        audioElement.currentTime=0;
        masterPlay.classList.remove('fa-circle-play')
        masterPlay.classList.add('fa-pause')
    })
})
document.getElementById('next').addEventListener('click', ()=>{
    if(songIndex>=10){
        songIndex=0
    }
    else{
        songIndex+=1;
    }
    audioElement.src=`songs/${songIndex+1}.mp3`;
    masterSongName.innerText=songs[songIndex].songName;
    audioElement.play();
    audioElement.currentTime=0;
    masterPlay.classList.remove('fa-circle-play')
    masterPlay.classList.add('fa-pause')
})
document.getElementById('previous').addEventListener('click', ()=>{
    if(songIndex<=0){
        songIndex=0
    }
    else{
        songIndex-=1;
    }
    audioElement.src=`songs/${songIndex+1}.mp3`;
    masterSongName.innerText=songs[songIndex].songName;
    audioElement.play();
    audioElement.currentTime=0;
    masterPlay.classList.remove('fa-circle-play')
    masterPlay.classList.add('fa-pause')
})
document.addEventListener("scroll", function () {
    let elements = document.querySelectorAll(".fade-in");
    let screenHeight = window.innerHeight;

    elements.forEach((el) => {
        let position = el.getBoundingClientRect().top;
        if (position < screenHeight - 100) {
            el.classList.add("visible");
        }
    });
});
// Dark Mode Toggle
const darkModeBtn = document.getElementById('darkModeToggle');

darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Button text change
    if (document.body.classList.contains('dark-mode')) {
        darkModeBtn.textContent = '☀️ Light Mode';
    } else {
        darkModeBtn.textContent = '🌙 Dark Mode';
    }
});
// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault(); // Scroll hone se rokne ke liye
        if (audioElement.paused || audioElement.currentTime <= 0) {
            audioElement.play();
            masterPlay.classList.remove('fa-play-circle');
            masterPlay.classList.add('fa-pause-circle');
        } else {
            audioElement.pause();
            masterPlay.classList.remove('fa-pause-circle');
            masterPlay.classList.add('fa-play-circle');
        }
    }
    if (e.code === 'ArrowRight') {
        songIndex = (songIndex + 1) % songs.length;
        audioElement.src = songs[songIndex].filePath;
        audioElement.currentTime = 0;
        audioElement.play();
    }
    if (e.code === 'ArrowLeft') {
        songIndex = (songIndex - 1 + songs.length) % songs.length;
        audioElement.src = songs[songIndex].filePath;
        audioElement.currentTime = 0;
        audioElement.play();
    }
});

