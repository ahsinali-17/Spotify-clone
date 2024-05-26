 let curFolder;
 let playingSong = new Audio();
 let songs;
 //fetching songs in the form of html table from client side
async function getSongs(folder) {
  curFolder = folder;
    let data = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let info = await data.text();
    let div = document.createElement("div");
    div.innerHTML = info;
    let atags = div.getElementsByTagName("a");
    let newSongs = [];
    for (let index = 0; index < atags.length; index++) {
      if (atags[index].href.endsWith(".mp3"))
        newSongs.push(atags[index].href.split(`/${folder}/`)[1]);
    }
      songs = newSongs;
    //displaying fetched songs on web in an ul tag...
    let fullname = songs.map((song) => song.replaceAll("%20", " "));
    let songList = document.querySelector(".songList ul");
    songList.innerHTML = ""
    for (const key in songs) {
      songList.innerHTML =
        songList.innerHTML +
        `<li>
       <img src="music.svg" alt="music">
       <div class="songinfo flex justify-center">
         <div class="name">
         ${decodeURI(songs[key]).slice(0, 30)}
         </div>
         <div class="artist">A.Ali</div>
       </div>
       <div class="playnow flex justify-center align-center">
       <img src="pause.svg" alt="play">
       <span>Play Now</span>
     </div>
     </li>`;
    }

    //adding event listener to play songs from list on click
    Array.from(songList.getElementsByTagName("li")).forEach((element) => { 
      let curSong = element.querySelector(".songinfo").firstElementChild.innerHTML.trim();
      //console.log(curSong)
      element.addEventListener("click", () => {
        const matchedSong = fullname.find(
          (e) => e.slice(0, 20) === curSong.slice(0, 20)
        );
        if (matchedSong) {
          playMusic(matchedSong.trim(),false);
        }
      });
    });
    return songs;
}

//playing and updating current track
const playMusic = (track, pause) => {
    playingSong.src = `${curFolder}/`+ track;
    if (!pause) {
      playingSong.load(); // Load the new source
        playingSong.play();
        play.src = "play.svg";
    }
    document.querySelector(".cursonginfo").innerHTML = decodeURI(track).slice(0, 30);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
  
};

//seconds to minutes
function secondsToMinutesAndSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function displayAlbums() {
  console.log("displaying albums")
  let a = await fetch(`http://127.0.0.1:5500/songs/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let array = Array.from(anchors)
   for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if(e.href.includes("/songs/")){
    let folder = e.href.split('/').slice(-1)[0]
    let cardContainer = document.querySelector(".card-container")
    //get metadata of folders
    let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
    let response = await a.json();
    cardContainer.innerHTML = cardContainer.innerHTML + `<div class="card">
    <img src="/songs/${folder}/image.jpg" alt="card image">
    <div data-folder="${folder}" class="play flex justify-center align-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#000">
            <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="#000000" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
    </div>
    <h2>${response.title}</h2>
    <p>${response.description}</p>
</div>`
    }
  }
} 


async function main() {
    let percent;
    await getSongs("songs/a");
    //displaying albums on the page
    await displayAlbums()
    playMusic(songs[0], true);
    //adding event listener to play,prev and next
    play.addEventListener("click", (e) => {
      if (playingSong.paused) {
        playingSong.play();
        play.src = "play.svg";
      } else {
        playingSong.pause();
        play.src = "pause.svg";
      }
    });

    prev.addEventListener("click", (e) => {
      const currentSongIndex = songs.indexOf(playingSong.src.split(`${curFolder}/`)[1]);
        let prevSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playMusic(songs[prevSongIndex], false);
    });
    
    
  next.addEventListener("click", (e) => {
    const currentSongIndex = songs.indexOf(playingSong.src.split(`${curFolder}/`)[1]);
      const nextSongIndex = (currentSongIndex + 1) % songs.length;
      console.log(playingSong.src.split(`/${curFolder}/`)[1])
      playMusic(songs[nextSongIndex], false);
  });
  
    //adding event listener for song's time updation
    playingSong.addEventListener("timeupdate", () => {
      document.querySelector(
        ".songtime"
      ).innerHTML = `${secondsToMinutesAndSeconds(
        playingSong.currentTime
      )}/${secondsToMinutesAndSeconds(playingSong.duration)}`;
      document.querySelector(".circle").style.left = (playingSong.currentTime/playingSong.duration)*100 +"%";
    });

    //event listener for seekbar updation
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
      let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
      document.querySelector(".circle").style.left = percent +"%";
      playingSong.currentTime = ((playingSong.duration)*percent)/100;
    })
    //event listener for hamburger and close svg
    ham.addEventListener("click",()=>{
      document.querySelector(".left").style.left="0%";
    })
    cross.addEventListener("click",()=>{
      document.querySelector(".left").style.left="-100%";
    })
     //event listener for volume control
     document.querySelector(".volseek").addEventListener("click",(e)=>{
      percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
      document.querySelector(".volcircle").style.left = percent +"%";
      playingSong.volume = percent/100;
     });
     //event listener to mute song
     vol.addEventListener("click",(e)=>{
         if(playingSong.volume != 0){
         playingSong.volume = 0
         vol.src = "mute.svg"
         document.querySelector(".volseek").style.opacity = "0.3";
         }
        else{
          playingSong.volume = percent/100;
        vol.src = "volume.svg"
        document.querySelector(".volseek").style.opacity = "1";
        }
     })
     //event listener for updating playlist with diff songs
  Array.from(document.getElementsByClassName("play")).forEach(item => {
    item.addEventListener("click", async (e) => {
        console.log(e.currentTarget.dataset.folder);
        songs = await getSongs(`/songs/${e.currentTarget.dataset.folder}`);
    });
});

}

main();
