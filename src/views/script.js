document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();

    // Récupérer les classements actuels des pilotes
    fetch(`https://ergast.com/api/f1/${currentYear}/driverStandings.json`)
        .then(response => response.json())
        .then(data => updateDriverStandings(data.MRData.StandingsTable.StandingsLists[0].DriverStandings))
        .catch(error => console.error('Erreur lors de la récupération des classements des pilotes:', error));

    // Récupérer les informations sur la prochaine course
    fetch(`https://ergast.com/api/f1/${currentYear}/next.json`)
        .then(response => response.json())
        .then(data => updateNextRaceInfo(data.MRData.RaceTable.Races[0]))
        .catch(error => console.error('Erreur lors de la récupération des infos sur la prochaine course:', error));

    // Récupérer les résultats du dernier Grand Prix
    fetch(`https://ergast.com/api/f1/${currentYear}/last/results.json`)
        .then(response => response.json())
        .then(data => {
            updateLastPodium(data.MRData.RaceTable.Races[0].Results);
            updateLastRaceName(data.MRData.RaceTable.Races[0].raceName);
        })
        .catch(error => console.error('Erreur lors de la récupération du dernier podium:', error));
});

function updateDriverStandings(standings) {
    const rankingList = document.getElementById('pilots-ranking');
    standings.forEach(driver => {
        const listItem = document.createElement('li');
        listItem.textContent = `${driver.position}. ${driver.Driver.familyName} (${driver.Constructors[0].name})`;
        rankingList.appendChild(listItem);
    });
}

function updateNextRaceInfo(raceInfo) {
    document.getElementById('race-location').textContent = raceInfo.raceName;
    startCountdown(raceInfo.date);
}

function startCountdown(raceDate) {
    const countdownElement = document.getElementById('countdown');
    const raceTime = new Date(raceDate).getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = raceTime - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownElement.textContent = "La course a commencé";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); 
}

function updateLastPodium(results) {
    const podiumList = document.getElementById('last-podium');
    podiumList.classList.add('last-ul');
    results.slice(0, 3).forEach(result => {
        const listItem = document.createElement('li');
        listItem.textContent = `${result.position}. ${result.Driver.familyName}`;
        podiumList.appendChild(listItem);
    });
}

function updateLastRaceName(raceName) {
    const lastRaceNameElement = document.getElementById('last-race-name');
    lastRaceNameElement.textContent = raceName;
}