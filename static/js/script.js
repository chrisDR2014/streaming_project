const container = document.querySelector(".container"),
  mainVideo = container.querySelector("video"),
  progressBar = container.querySelector(".progress-bar"),
  videoTimeline = container.querySelector(".video-timeline"),
  playPauseBtn = container.querySelector(".play-pause i"),
  currentVidTime = container.querySelector(".current-time"),
  videoDuration = container.querySelector(".video-duration"),
  skipForwardBtn = container.querySelector(".skip-forward i"),
  skipBackwardBtn = container.querySelector(".skip-backward i"),
  volumeBtn = container.querySelector(".volume i"),
  volumeSlider = container.querySelector(".left input"),
  speedBtn = container.querySelector(".playback-speed span"),
  speedOptions = container.querySelector(".speed-options"),
  picInPicBtn = container.querySelector(".pic-in-pic span"),
  fullscreenBtn = container.querySelector(".fullscreen i");
let timer;

const hideControls = () => {
  if (mainVideo.paused) return;
  timer = setTimeout(() => {
    container.classList.remove("show-controls");
  }, 500);
};

hideControls();

container.addEventListener("mousemove", () => {
  container.classList.add("show-controls");
  clearTimeout(timer);
  hideControls();
});

const formatTime = (time) => {
  let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  hours = hours < 10 ? `0${hours}` : hours;

  if (hours != 0) {
    return `${hours}:${minutes}:${seconds}`;
  } else {
    return `${minutes}:${seconds}`;
  }
};

mainVideo.addEventListener("timeupdate", (e) => {
  let { currentTime, duration } = e.target; // getting currentTime & duration of the video
  let percent = (currentTime / duration) * 100; // calculating the percentage of the video played
  progressBar.style.width = `${percent}%`; // setting the width of the progress bar
  currentVidTime.innerText = formatTime(currentTime); // setting the current timeline
});

mainVideo.addEventListener("loadeddata", (e) => {
  videoDuration.innerText = formatTime(e.target.duration);
});

videoTimeline.addEventListener("click", (e) => {
  let timelineWidth = videoTimeline.clientWidth;
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // setting the currentTime of the video to the percentage of
  // progressTime.innerText = formatTime(currentTime);
});

const draggableProgressBar = (e) => {
  let timelineWidth = videoTimeline.clientWidth;
  progressBar.style.width = `${e.offsetX}px`;
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // setting the currentTime of the video to the percentage of
  currentVidTime.innerText = formatTime(mainVideo.currentTime);
};

videoTimeline.addEventListener("mousedown", (e) => {
  videoTimeline.addEventListener("mousemove", draggableProgressBar);
});

document.addEventListener("mouseup", (e) => {
  videoTimeline.removeEventListener("mousemove", draggableProgressBar);
});

videoTimeline.addEventListener("mousemove", (e) => {
  const progressTime = videoTimeline.querySelector("span");
  let offsetX = e.offsetX;
  progressTime.style.left = `${offsetX - 5}px`;
  let timelineWidth = videoTimeline.clientWidth;
  let percent = (offsetX / timelineWidth) * mainVideo.duration;
  progressTime.innerText = formatTime(percent);
});

let previousVolume = 0.5;
mainVideo.volume = 0.5;

volumeBtn.addEventListener("click", () => {
  if (mainVideo.volume !== 0) {
    // If volume is not muted  mute the volume
    previousVolume = mainVideo.volume; // Store current volume as previousVolume
    mainVideo.volume = 0.0; // Mute the volume
    volumeSlider.value = 0; // Set volume slider to 0
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark"); // Change the volume icon to volume high icon
  } else {
    mainVideo.volume = previousVolume; // Set volume to previousVolume
    volumeSlider.value = previousVolume; // Update volume slider value
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high"); // Change the volume icon to volume high icon
  }
  console.log(mainVideo.volume);
});

volumeSlider.addEventListener("input", (e) => {
  mainVideo.volume = e.target.value; // passing the value of the volume slider as video volume
  if (e.target.value == 0) {
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark"); // changing the volume icon to volume high icon
  } else {
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high"); // changing the volume icon to volume high icon
  }
  console.log(mainVideo.volume);
});

skipBackwardBtn.addEventListener("click", () => {
  mainVideo.currentTime -= 5; // skipping backward by 5 seconds
});
skipForwardBtn.addEventListener("click", () => {
  mainVideo.currentTime += 5; // skipping forward by 5 seconds
});

playPauseBtn.addEventListener("click", () => {
  // if video is paused, play the video else pause the video
  mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener("play", () => {
  // if video is playing, change the icon to pause
  playPauseBtn.classList.replace("fa-play", "fa-pause");
});

mainVideo.addEventListener("pause", () => {
  // if video is paused, change the icon to play
  playPauseBtn.classList.replace("fa-pause", "fa-play");
});

speedBtn.addEventListener("click", () => {
  speedOptions.classList.toggle("show"); // showing the speed options
});

document.addEventListener("click", (e) => {
  // hide speed options on document click
  if (e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded") {
    speedOptions.classList.remove("show");
  }
});

speedOptions.querySelectorAll("li").forEach((option) => {
  option.addEventListener("click", () => {
    // adding event listener to each option
    mainVideo.playbackRate = option.dataset.speed; // passing option dataset value as video playback rate
    speedOptions.querySelector(".active").classList.remove("active"); // removing active class from the active option
    option.classList.add("active"); // adding active class to the clicked option
  });
});

picInPicBtn.addEventListener("click", () => {
  mainVideo.requestPictureInPicture(); // requesting picture in picture
});

fullscreenBtn.addEventListener("click", () => {
  mainVideo.requestFullscreen(); // requesting fullscreen
});
