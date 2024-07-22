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
 * @function updatePositionData
 * @description Met à jour les données de position des pilotes
 */
async function updatePositionData() {
    try {
        const response = await fetch('/live/getstandings');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const top20 = await response.json();

        animatePositionChanges(top20);

        if (session_type === "Practice" || session_type === "Qualifying") {
            updateClassement('Classement', top20);
        } else if (session_type === "Race") {
            updateClassement('Classement', top20);
        }
    } catch (error) {
        console.error('Error fetching standings:', error);
    }
}

/**
 * @function animatePositionChanges
 * @description Réalise l'animation de changement de position d'un pilote
 * @param {*} top20
 * @returns {void}
 */
function animatePositionChanges(top20) {
    // Crée une copie des positions actuelles pour comparer
    const currentPositions = {};
    top20.forEach((driver, index) => {
        currentPositions[driver.driver_number] = index;
    });

    Object.keys(previousStandings).forEach(driverNumber => {
        const previousPosition = previousStandings[driverNumber];
        const currentPosition = currentPositions[driverNumber];

        if (currentPosition !== undefined && previousPosition !== undefined && currentPosition !== previousPosition) {
            const driverElement = document.querySelector(`.driver[data-driver-number='${driverNumber}']`);
            if (driverElement) {
                // Trouve l'élément de la liste des pilotes
                const parent = driverElement.parentElement;
                const children = Array.from(parent.children);

                // Trouve les index des éléments précédents et nouveaux
                const previousIndex = children.indexOf(driverElement);
                const newIndex = currentPosition;

                // Détermine le delta de déplacement
                const delta = newIndex - previousIndex;

                // Applique la transformation CSS pour animer le déplacement
                driverElement.style.transition = 'transform 1s ease-in-out';
                driverElement.style.transform = `translateY(${delta * 100}px)`;
                setTimeout(() => {
                    driverElement.style.transform = '';
                }, 1000);
            }
        }
    });

    // Mettez à jour les positions précédentes
    top20.forEach((driver, index) => {
        previousStandings[driver.driver_number] = index;
    });
}

function updateClassement(containerId, top20) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';  // Nettoyer les anciens éléments

    const titles = document.createElement('div');
    titles.classList.add('grid', 'grid-cols-2', 'justify-center', 'items-center', 'pb-4', 'font-F1Bold', 'text-base');
    titles.innerHTML = `
        <span>Pos</span>
        <span>Drivers</span>`;
    container.appendChild(titles);

    top20.forEach((driver, index) => {
        const driverDiv = document.createElement('div');
        driverDiv.classList.add('grid', 'grid-cols-2', 'justify-center', 'items-center', 'driver');
        driverDiv.setAttribute('data-driver-number', driver.driver_number);
        driverDiv.innerHTML = `
            <span class="rank font-F1Bold">${String(index + 1).padStart(2, '0')}</span>
            <span class="pilot-number">${driver.driver_number}</span>
        `;

        // Ajoutez le nouveau pilote au conteneur
        container.appendChild(driverDiv);
    });

    // Mettez à jour les positions précédentes
    top20.forEach((driver, index) => {
        previousStandings[driver.driver_number] = index;
    });

    console.log(top20)
}

/**
 * @function updateStandings
 * @description Met à jour l'affichage du classement en direct avec les fonctions ci-dessus
 * @returns {void}
 */
async function updateStandings() {
    console.log("updated")
    await updatePositionData();
}

// appel et mise à jour périodique
updateStandings();
setInterval(updateStandings, 10000);