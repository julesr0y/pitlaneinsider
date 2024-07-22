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
    1: "VER",
    20: "MAG",
    2: "SAR",
    3: "RIC",
    10: "GAS",
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
        const stintResponse = await fetch('https://api.openf1.org/v1/stints?session_key=latest');
        const stintData = await stintResponse.json();
        const pitResponse = await fetch('https://api.openf1.org/v1/pit?session_key=latest');
        const pitData = await pitResponse.json();
        const positionResponse = await fetch('https://api.openf1.org/v1/position?session_key=latest');
        const positionData = await positionResponse.json();

        return { stintData, pitData, positionData };
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return null;
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
 * @function updateClassement
 * @description Réalise l'animation de changement de position d'un pilote
 * @param {*} containerIdtop20
 * @param {*} top20
 * @returns {void}
 */
function updateClassement(containerId, top20) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const titles = document.createElement('div');
    titles.classList.add('grid', 'grid-cols-4', 'justify-center', 'items-center', 'pb-4', 'font-F1Bold');
    titles.innerHTML = `
        <span>Position</span>
        <span>Drivers</span>
        <span>Pits</span>
        <span>Tyres</span>`;
    container.appendChild(titles);
    top20.forEach((driver, index) => {
        const driverDiv = document.createElement('div');
        driverDiv.classList.add('grid', 'grid-cols-4', 'justify-center', 'items-center', 'py-2', 'border-b', 'border-gray-300');
        driverDiv.classList.add('driver');
        driverDiv.setAttribute('data-driver-number', driver.driver_number);
        driverDiv.innerHTML = `
            <span class="rank font-bold">${index + 1}.</span>
            <span class="pilot-name">${driverMapping[driver.driver_number]}</span>
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

/**
 * @function updateStandings
 * @description Met à jour l'affichage du classement en direct avec les fonctions ci-dessus
 * @returns {void}
 */
async function updateStandings() {
    const data = await fetchData();
    if (data) {
        updateLastCompound(data.stintData);
        updateDriverAppearances(data.pitData);
        updatePositionData(data.positionData);
    }
}

// appel et mise à jour périodique
updateStandings();
setInterval(updateStandings, 10000);