/**
 * @function injectCSS
 * @description Injecte le CSS nécessaire pour les classements en direct
 * @returns {void}
 */
function injectCSS() {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes highlight {
            0% {
                background-color: #e0f7fa;
            }
            100% {
                background-color: transparent;
            }
        }

        .highlight {
            animation: highlight 2s ease;
        }

        .arrow-up {
            content: url('img/live/arrow-up.png');
            display: inline-block;
            margin-left: 5px;
            width: 12px;
            height: 12px;
        }

        .arrow-down {
            content: url('img/live/arrow-down.png');
            display: inline-block;
            margin-left: 5px;
            width: 12px;
            height: 12px;
        }

        .arrow-up::after {
            content: url('img/live/arrow-up.png');
            display: inline-block;
            margin-left: 5px;
            width: 12px;
            height: 12px;
        }

        .arrow-down::after {
            content: url('img/live/arrow-down.png');
            display: inline-block;
            margin-left: 5px;
            width: 12px;
            height: 12px;
        }

        .driver {
            transition: transform 1s ease-in-out;
        }

        .rank {
            display: flex;
            align-items: center;
        }

        @media (max-width: 600px) {
            .grid-cols-4 {
                grid-template-columns: 1fr 2fr 1fr 1fr;
            }
            .header-name, .rank, .pilot-name, .pits, .tyres {
                font-size: 12px;
            }
            .pilot-name {
                font-size: 10px;
            }
        }
    `;
    document.head.appendChild(style);
}

injectCSS();

const driverMapping = {
    1: "Verstappen",
    20: "Magnussen",
    2: "Sargeant",
    3: "Ricciardo",
    10: "Gasly",
    44: "Hamilton",
    55: "Sainz",
    16: "Leclerc",
    77: "Bottas",
    63: "Russell",
    11: "Perez",
    4: "Norris",
    18: "Stroll",
    14: "Alonso",
    31: "Ocon",
    23: "Albon",
    22: "Tsunoda",
    81: "Piastri",
    24: "Zhou",
    27: "Hulkenberg"
};

var session_type;
const bestLaps = {};
const lastCompound = {};
const result = {};
const driverAppearances = {
    1: 0, 20: 0, 2: 0, 3: 0, 10: 0, 44: 0, 55: 0,
    16: 0, 77: 0, 63: 0, 11: 0, 4: 0, 18: 0, 14: 0,
    31: 0, 23: 0, 22: 0, 81: 0, 24: 0, 27: 0
};

const previousStandings = {};

/**
 * @function fetchData
 * @description Récupère les données de la session en cours
 * @returns {Promise}
 */
async function fetchData() {
    try {
        const sessionResponse = await fetch('https://api.openf1.org/v1/sessions?session_key=latest');
        const sessionData = await sessionResponse.json();
        const stintResponse = await fetch('https://api.openf1.org/v1/stints?session_key=latest');
        const stintData = await stintResponse.json();
        const pitResponse = await fetch('https://api.openf1.org/v1/pit?session_key=latest');
        const pitData = await pitResponse.json();
        const positionResponse = await fetch('https://api.openf1.org/v1/position?session_key=latest');
        const positionData = await positionResponse.json();

        return { sessionData, stintData, pitData, positionData };
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return null;
    }
}

/**
 * @function updateSessionInfo
 * @description Met à jour les informations de la session en cours
 * @param {*} data
 * @returns {void}
 */
function updateSessionInfo(data) {
    if (data && data.length > 0) {
        const { location, session_name, session_type: type } = data[0];
        session_type = type;
        frontLocation.textContent = location;
        frontSession.textContent = session_name;
    }
}

/**
 * @function updateLastCompound
 * @description Met à jour les composés de pneus des pilotes de la session en cours
 * @param {*} stintData
 * @returns {void}
 */
function updateLastCompound(stintData) {
    stintData.forEach(({ driver_number, lap_end, compound }) => {
        if (!lastCompound[driver_number] || lap_end > lastCompound[driver_number].lap_end) {
            lastCompound[driver_number] = { compound, lap_end };
        }
    });
    for (const driver in lastCompound) {
        result[driver] = lastCompound[driver].compound;
    }
}

/**
 * @function updateDriverAppearances
 * @description Met à jour le nombre de pits des pilotes de la session en cours
 * @param {*} pitData
 * @returns {void}
 */
function updateDriverAppearances(pitData) {
    Object.keys(driverAppearances).forEach(key => driverAppearances[key] = 0);
    pitData.forEach(({ driver_number }) => {
        if (driverAppearances.hasOwnProperty(driver_number)) {
            driverAppearances[driver_number]++;
        }
    });
}

/**
 * @function updatePositionData
 * @description Met à jour le nombre de pits des pilotes de la session en cours
 * @param {*} positionData
 * @returns {void}
 */
function updatePositionData(positionData) {
    const classement = {};

    positionData.forEach(driver => {
        if (!classement[driver.driver_number]) {
            classement[driver.driver_number] = { driver_number: driver.driver_number, last_position: 0 };
        }
        classement[driver.driver_number].last_position = driver.position;
    });

    const classementArray = Object.values(classement).sort((a, b) => a.last_position - b.last_position);
    const top20 = classementArray.slice(0, 20);

    animatePositionChanges(top20);

    if (session_type === "Practice" || session_type === "Qualifying") {
        updateClassement('Classement', top20);
    } else if (session_type === "Race") {
        updateClassement('Classement', top20);
    }
}

/**
 * @function animatePositionChanges
 * @description Réalise l'animation de changement de position d'un pilote
 * @param {*} top20
 * @returns {void}
 */
function animatePositionChanges(top20) {
    top20.forEach(driver => {
        const previousPosition = previousStandings[driver.driver_number];
        if (previousPosition !== undefined) {
            const previousElement = document.querySelector(`.driver[data-driver-number='${driver.driver_number}']`);
            if (previousElement) {
                const previousIndex = Array.from(previousElement.parentElement.children).indexOf(previousElement);
                const newIndex = top20.findIndex(d => d.driver_number === driver.driver_number);
                const delta = newIndex - previousIndex;

                previousElement.style.transform = `translateY(${delta * 100}%)`;
                setTimeout(() => {
                    previousElement.style.transform = '';
                }, 1000);
            }
        }
    });
}

/**
 * @function convertToMMSSDDD
 * @description Convertit un temps en secondes en format mm:ss:ddd (minutes:secondes:millisecondes)
 * @param {number} seconds Le temps en secondes
 * @returns {string} Le temps formaté en mm:ss:ddd
 */
function convertToMMSSDDD(seconds) {
    // Convertir le temps en secondes en minutes, secondes, et millisecondes
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);

    // Formatage avec deux chiffres pour les minutes et secondes et trois chiffres pour les millisecondes
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
}
const bestLapsTimes = {}; // Pour stocker les meilleurs temps de chaque pilote

/**
 * @function updateBestLaps
 * @description Récupère les temps au tour des pilotes et détermine leur meilleur temps
 * @returns {void}
 */
async function updateBestLaps() {
    try {
        const lapsResponse = await fetch('https://api.openf1.org/v1/laps?session_key=latest');
        const lapsData = await lapsResponse.json();

        // Réinitialiser les meilleurs temps
        const currentBestLaps = {};

        lapsData.forEach(({ driver_number, lap_duration }) => {
            const lapDuration = parseFloat(lap_duration); // Assurez-vous que c'est un nombre

            // Vérifier si nous avons déjà un meilleur temps pour ce pilote
            if (!currentBestLaps[driver_number] || lapDuration < currentBestLaps[driver_number]) {
                currentBestLaps[driver_number] = lapDuration;
            }
        });

        // Mettre à jour bestLapsTimes avec les meilleurs temps trouvés, formatés
        Object.keys(currentBestLaps).forEach(driver => {
            bestLapsTimes[driver] = convertToMMSSDDD(currentBestLaps[driver]);
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des temps au tour:', error);
    }
}


let maxLapsOverall = 0; // Variable pour stocker le nombre de tours maximum

function updateLaps() {
    if (session_type === 'Race') {
    fetch('https://api.openf1.org/v1/laps?session_key=latest')
        .then(response => response.json())
        .then(data => {
            data = data.reverse(); // On inverse l'ordre des données pour récupérer le dernier élément en premier
            
                // Vérifiez si les données sont valides et si lap_number existe
                if (data && data.length > 0 && data[0].lap_number !== undefined) {
                    const laps = data[0].lap_number; // Récupère le nombre de tours du dernier élément

                    // Si le nouveau nombre de tours est supérieur à maxLapsOverall, mettez à jour maxLapsOverall
                    if (laps > maxLapsOverall) {
                        maxLapsOverall = laps;
                    }
                    
                    // Affichez le nombre de tours dans l'élément HTML avec l'id 'lap'
                    const lapElement = document.getElementById('lap');
                    if (lapElement) {
                        lapElement.textContent = `Tour ${maxLapsOverall}`;
                    }
                } else {
                    console.error('Les données de tours reçues sont invalides.');
                }
            })
        .catch(error => {
            console.error('Erreur lors de la récupération des données de tours:', error);
        });
    }
}

// appel et mise à jour périodique
updateLaps();
setInterval(updateLaps, 10000);



/**
 * @function updateClassement
 * @description Met à jour le classement avec les meilleures performances
 * @param {*} containerId Identifiant du conteneur HTML pour le classement
 * @param {*} top20 Liste des pilotes à afficher
 * @returns {void}
 */
function updateClassement(containerId, top20) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Element with ID "${containerId}" not found`);
        return;
    }
    
    container.innerHTML = '';

    const titles = document.createElement('div');
    titles.classList.add('grid', 'grid-cols-5', 'justify-center', 'items-center', 'pb-4', 'font-F1Bold');
    titles.innerHTML = `
        <span>Position</span>
        <span>Drivers</span>
        <span>Best Lap</span>
        <span>Pits</span>
        <span>Tyres</span>
        
    `;
    container.appendChild(titles);

    top20.forEach((driver, index) => {
        const driverDiv = document.createElement('div');
        driverDiv.classList.add('grid', 'grid-cols-5', 'justify-center', 'items-center', 'py-2', 'border-b', 'border-gray-300');
        driverDiv.classList.add('driver');
        driverDiv.setAttribute('data-driver-number', driver.driver_number);
        driverDiv.innerHTML = `
            <span class="rank font-bold">${index + 1}.</span>
            <span class="pilot-name">${driverMapping[driver.driver_number]}</span>
            <span class="best-lap">${bestLapsTimes[driver.driver_number] || 'N/A'}</span>
            <span class="pits">${driverAppearances[driver.driver_number]}</span>
            <span class="pneus"><img class="h-6 w-auto" src="/img/tires/${(result[driver.driver_number]).toLowerCase() || 'n/a'}.svg"></span>
        `;

        if (previousStandings[driver.driver_number] !== undefined && previousStandings[driver.driver_number] !== driver.last_position) {
            const rankSpan = driverDiv.querySelector('.rank');
            if (previousStandings[driver.driver_number] > driver.last_position) {
                rankSpan.classList.add('arrow-up');
            } else {
                rankSpan.classList.add('arrow-down');
            }
            setTimeout(() => {
                rankSpan.classList.remove('arrow-up', 'arrow-down');
            }, 3000);

            driverDiv.classList.add('highlight');
            setTimeout(() => {
                driverDiv.classList.remove('highlight');
            }, 2000);
        }

        previousStandings[driver.driver_number] = driver.last_position;
        container.appendChild(driverDiv);
    });
}

async function updateStandings() {
    const data = await fetchData();
    if (data) {
        updateSessionInfo(data.sessionData);
        updateLastCompound(data.stintData);
        updateDriverAppearances(data.pitData);
        await updateBestLaps();
        await updateLaps();
        updatePositionData(data.positionData);
    }
}

// appel et mise à jour périodique
updateStandings();
setInterval(updateStandings, 10000);