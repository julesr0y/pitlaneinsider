const Radio = document.getElementById('Radio');

const driverRadioMapping = {
    1: "VER",
    10: "GAS",
    30: "LAW",
    7: "DOO",
    44: "HAM",
    55: "SAI",
    16: "LEC",
    63: "RUS",
    4: "NOR",
    18: "STR",
    14: "ALO",
    31: "OCO",
    23: "ALB",
    22: "TSU",
    81: "PIA",
    27: "HUL",
    5: "BOR",
    6: "HAD",
    12: "ANT",
    87: "BEA"
};

const teamRadioMapping = {
    1: "red-bull",
    10: "alpine",
    30: "red-bull",
    7: "alpine",
    44: "ferrari",
    55: "williams",
    16: "ferrari",
    63: "mercedes",
    4: "mclaren",
    18: "aston-martin",
    14: "aston-martin",
    31: "haas",
    23: "williams",
    22: "rb",
    81: "mclaren",
    27: "kick-sauber",
    5: "kick-sauber",
    6: "rb",
    12: "mercedes",
    87: "haas"
};

let addedRecordings = new Set();
let firstLoad = true;

/**
 * @function updateRadio
 * @description Récupère et affiche les dernières radios en direct
 * @returns {void}
 */
function updateRadio() {
    fetch('https://api.openf1.org/v1/team_radio?session_key=latest')
        .then(response => response.json())
        .then(data => {
            data = data.reverse(); // On inverse l'ordre pour avoir les dernières radios en premier
            let radioHTML = '';
            data.forEach(radio => {
                if (!addedRecordings.has(radio.recording_url)) {
                    radioHTML += `
                    <div class="bg-${teamRadioMapping[radio.driver_number]} player flex items-center gap-3 w-4/5 md:w-3/5 p-4 rounded-3xl mt-3">
                        <img class="playButton h-4 w-auto" src="/img/assets/play.svg" alt="Play">
                        <div class="progressContainer rounded-3xl" style="width: 100%; background-color: #fff; height: 10px; position: relative;">
                            <div class="progressBar rounded-3xl" style="width: 0%; background-color: #000; height: 10px; position: absolute;"></div>
                        </div>
                        <span class="currentTime">0:00</span>
                        <span>/</span>
                        <span class="duration">0:00</span>
                        <span class="text-white">${driverRadioMapping[radio.driver_number]}</span>
                        <audio class="audio" style="display:none;">
                            <source class="audioSource"
                                src="${radio.recording_url}"
                                type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                    </div>`;
                    addedRecordings.add(radio.recording_url);
                }
            });
            if (firstLoad) {
                document.getElementById('Radio').innerHTML += radioHTML;
                firstLoad = false;
            } else {
                document.getElementById('NewRadio').innerHTML += radioHTML;
            }
            attachEventListeners();
        })
}

/**
 * @function attachEventListeners
 * @description Récupère les actions sur les boutons associés à la lecture des radios
 * @returns {void}
 */
function attachEventListeners() {
    const audioElements = document.querySelectorAll('.audio');
    const playButtons = document.querySelectorAll('.playButton');
    const progressBars = document.querySelectorAll('.progressBar');
    const currentTimes = document.querySelectorAll('.currentTime');
    const durations = document.querySelectorAll('.duration');

    audioElements.forEach((audioElement, index) => {
        const playButton = playButtons[index];
        const progressBar = progressBars[index];
        const currentTime = currentTimes[index];
        const duration = durations[index];

        playButton.addEventListener('click', () => {
            if (audioElement.paused) {
                audioElement.play();
                playButton.src = '/img/assets/pause.svg'; // Changez ceci à votre image de pause
            } else {
                audioElement.pause();
                playButton.src = '/img/assets/play.svg'; // Changez ceci à votre image de play
            }
        });

        audioElement.addEventListener('timeupdate', () => {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            progressBar.style.width = `${progress}%`;

            const minutes = Math.floor(audioElement.currentTime / 60);
            const seconds = Math.floor(audioElement.currentTime % 60);
            currentTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        });

        audioElement.addEventListener('loadedmetadata', () => {
            const durationMinutes = Math.floor(audioElement.duration / 60);
            const durationSeconds = Math.floor(audioElement.duration % 60);
            duration.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
        });

        audioElement.addEventListener('ended', () => {
            playButton.src = '/img/assets/play.svg'; // Changez ceci à votre image de play
        });
    });
}

// appel et mise à jour périodique
updateRadio();
setInterval(updateRadio, 60000); // Mise à jour toutes les minutes