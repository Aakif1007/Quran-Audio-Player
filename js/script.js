let currentSurah = new Audio();
let surahs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSurahs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  surahs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      surahs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  //show all the surahs in the playlist
  let surahUL = document
    .querySelector(".surahList")
    .getElementsByTagName("ul")[0];
  surahUL.innerHTML = "";

  for (const surah of surahs) {
    surahUL.innerHTML =
      surahUL.innerHTML +
      `<li>
                <img class="invert" src="img/qicon.svg" alt="" />
                <div class="info">
                  <div>${decodeURIComponent(surah).replaceAll("%20", " ")}</div>
                </div>
                <div class="playnow">
                  <span>Play now</span>
                  <img class="invert" src="img/play.svg" alt=""> 
                </div></li>`;
  }

  //Attach an eventlistener to each Surah
  Array.from(
    document.querySelector(".surahList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playSurah(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
}

const playSurah = (track, pause = false) => {
  currentSurah.src = `/${currFolder}/` + track;

  if (!pause) {
    currentSurah.play();
    play.src = "img/pause.svg";
  }

  const surahInfoElement = document.querySelector(".surahinfo");
  const surahTimeElement = document.querySelector(".surahtime");

  if (surahInfoElement) {
    surahInfoElement.innerHTML = decodeURI(track);
  } else {
    console.error("Element #surahinfo not found");
  }

  if (surahTimeElement) {
    surahTimeElement.innerHTML = "00:00 / 00:00";
  } else {
    console.error("Element #surahtime not found");
  }
};

async function main() {
  //Get list of surahs
  await getSurahs("Qaris/Sudais");
  playSurah(surahs[0], true);

  //Attach an eventlistener to previous,play,next
  play.addEventListener("click", () => {
    if (currentSurah.paused) {
      currentSurah.play();
      play.src = "img/pause.svg";
    } else {
      currentSurah.pause();
      play.src = "img/play.svg";
    }
  });

  //Listen fo timeupdate event
  currentSurah.addEventListener("timeupdate", () => {
    document.querySelector(".surahtime").innerHTML = `${secondsToMinutesSeconds(
      currentSurah.currentTime
    )} / ${secondsToMinutesSeconds(currentSurah.duration)}`;

    document.querySelector(".circle").style.left =
      (currentSurah.currentTime / currentSurah.duration) * 100 + "% ";
  });

  //Add eventlistener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";

    currentSurah.currentTime = (currentSurah.duration * percent) / 100;
  });

  //Add an event listener to hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

  //Add an event listener to close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  //Add an event listener to previous
  // Assume `surahs` is defined at a higher scope
  // Add an event listener to previous
  previous.addEventListener("click", () => {
    currentSurah.pause();
    console.log("Previous clicked");

    let currentTrack = currentSurah.src.split("/").pop(); // Get current track name
    console.log("Current Track:", currentTrack);

    let index = surahs.indexOf(currentTrack);
    console.log("Current Index:", index);

    if (index > 0) {
      console.log("Playing Previous Track:", surahs[index - 1]);
      playSurah(surahs[index - 1]);
    } else {
      console.log("No previous track available.");
    }
  });

  // Add an event listener to next
  next.addEventListener("click", () => {
    currentSurah.pause();
    console.log("Next clicked");

    let currentTrack = currentSurah.src.split("/").pop(); // Get current track name
    console.log("Current Track:", currentTrack);

    let index = surahs.indexOf(currentTrack);
    console.log("Current Index:", index);

    if (index !== -1 && index + 1 < surahs.length) {
      console.log("Playing Next Track:", surahs[index + 1]);
      playSurah(surahs[index + 1]);
    } else {
      console.log("No next track available.");
    }
  });

  //Add an event to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentSurah.volume = parseInt(e.target.value) / 100;
    });

  //Load the library whenever the card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      // Clear the current track and stop playback
      currentSurah.pause();
  
      // Get the new surahs for the selected reciter
      await getSurahs(`Qaris/${item.currentTarget.dataset.folder}`);
      console.log("Updated Surahs for new reciter:", surahs);
      
      // Reset or play the first surah if available
      if (surahs.length > 0) {
        playSurah(surahs[0], true);
      }
    });
  });

  //Play button click 

  document.querySelector(".play").addEventListener("click",()=>{
    
  })

  
}

main();
