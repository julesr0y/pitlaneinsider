document.addEventListener('DOMContentLoaded', function () {
    const currentYear = new Date().getFullYear();

    // Récupérer les informations sur la prochaine course
    fetch(`https://ergast.com/api/f1/${currentYear}/next.json`)
        .then(response => response.json())
        .then(data => updateNextRaceInfo(data.MRData.RaceTable.Races[0]))
        .catch(error => console.error('Erreur lors de la récupération des infos sur la prochaine course:', error));
});

/**
 * @description Met à jour les informations de la prochaine course
 * @param {*} raceInfo
 * @returns {void}
 */
function updateNextRaceInfo(raceInfo) {
    document.getElementById('race-location').textContent = raceInfo.Circuit.Location.country;
    const flagElement = document.getElementById('flag');
    flagElement.innerHTML = ''; // Clear any existing flag
    const img = document.createElement('img');
    img.setAttribute('class', 'h-6 w-auto');
    img.setAttribute('src', `/img/countryFlags/${(raceInfo.Circuit.Location.country).toLowerCase()}.svg`);
    flagElement.appendChild(img);

    // Inclure l'heure de la course dans le démarrage du compte à rebours
    startCountdown(raceInfo.date, raceInfo.time);
}

/**
 * @description Démarre le compte à rebours pour la prochaine course
 * @param {string} raceDate
 * @param {string} raceTime
 * @returns {void}
 */
function startCountdown(raceDate, raceTime) {
    const raceDateTime = new Date(`${raceDate}T${raceTime}`).getTime();
    let previousDays, previousHours, previousMinutes, previousSeconds;

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = raceDateTime - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').innerHTML = `<div class="col-span-12">La course a commencé</div>`;
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (days !== previousDays) {
            updateTimeElement('days', days);
            previousDays = days;
        }
        if (hours !== previousHours) {
            updateTimeElement('hours', hours);
            previousHours = hours;
        }
        if (minutes !== previousMinutes) {
            updateTimeElement('minutes', minutes);
            previousMinutes = minutes;
        }
        if (seconds !== previousSeconds) {
            updateTimeElement('seconds', seconds);
            previousSeconds = seconds;
        }
    }

    function updateTimeElement(id, value) {
        const element = document.getElementById(id);
        element.classList.remove('animation-slide');
        void element.offsetWidth; // Trigger reflow to restart the animation
        element.classList.add('animation-slide');
        element.textContent = String(value).padStart(2, '0');
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
}
