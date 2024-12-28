const Radio = document.getElementById('Radio');

const driverRadioMapping = {
    1: "VER",
    20: "MAG",
    2: "SAR",
    3: "RIC",
    10: "GAS",
    30: "LAW",
    43: "COL",
    61: "DOO",
    44: "HAM",
    55: "SAI",
    16: "LEC",
    77: "BOT",
    63: "RUS",
    11: "PER",
    4: "NOR",
    18: "STR",
    14: "ALO",
    31: "OCO",
    23: "ALB",
    22: "TSU",
    81: "PIA",
    24: "ZHO",
    27: "HUL"
};

const teamRadioMapping = {
    44: "mercedes",
    63: "mercedes",
    1: "red-bull",
    11: "red-bull",
    4: "mclaren",
    81: "mclaren",
    14: "aston-martin",
    18: "aston-martin",
    10: "alpine",
    31: "alpine",
    61: "alpine",
    16: "ferrari",
    55: "ferrari",
    3: "rb",
    22: "rb",
    30: "rb",
    24: "kick-sauber",
    77: "kick-sauber",
    20: "haas",
    27: "haas",
    23: "williams",
    2: "williams",
    43: "williams",
};

let addedRecordings = new Set();

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
            document.getElementById('Radio').innerHTML += radioHTML;
            attachEventListeners(); // Attachez les écouteurs d'événements après avoir ajouté les nouveaux éléments
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