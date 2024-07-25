var currentRankings = []
var currentStints = []

async function fetchDataRankings() {
    try {
        const response = await fetch('/live/getstandings');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des classements :", error);
        throw error;
    }
}

async function fetchStintData() {
    try {
        const response = await fetch('/live/getstints');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des classements :", error);
        throw error;
    }
}

async function fetchIntervalsData() {
    try {
        const response = await fetch('/live/getintervals');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des classements :", error);
        throw error;
    }
}

let currentFirstPlaceDriverId = null;
let isFirstTimeLoaded = true; // permet de désactiver l'animation de meilleur tour au chargement de la page pour la première fois

function renderRankings(rankings) {
    const classementDiv = document.getElementById('Classement');

    const children = Array.from(classementDiv.children).slice(1);
    children.forEach(child => classementDiv.removeChild(child));

    rankings.forEach((driver, index) => {
        const driverDiv = document.createElement('div');
        driverDiv.className = 'grid grid-cols-4 justify-center items-center driver move gap-x-2';
        driverDiv.dataset.driverCode = driver.driver_code;

        if (index === 0 && !isFirstTimeLoaded) {
            if (currentFirstPlaceDriverId !== driver.driver_code) {
                driverDiv.classList.add('first-place');
                currentFirstPlaceDriverId = driver.driver_code;
            }
        }
        else if (index === 0 && isFirstTimeLoaded) {
            currentFirstPlaceDriverId = driver.driver_code;
        }

        const rankSpan = document.createElement('span');
        rankSpan.className = 'rank font-F1Bold px-4';
        rankSpan.textContent = `${(index + 1).toString().padStart(2, '0')}`;

        const numberSpan = document.createElement('span');
        numberSpan.className = 'pilot-number';
        numberSpan.textContent = driver.driver_code;

        const gapSpan = document.createElement('span');
        gapSpan.className = 'pilot-gap';
        gapSpan.textContent = "+" + driver.interval;

        const tyreSpan = document.createElement('span');
        tyreSpan.className = 'pilot-compound flex';
        const tyreIco = document.createElement('img');
        tyreIco.src = `/img/tires/${driver.compound.toLowerCase()}.svg`;
        tyreIco.className = 'h-5 w-auto flex';
        tyreSpan.appendChild(tyreIco);

        driverDiv.appendChild(rankSpan);
        driverDiv.appendChild(numberSpan);
        driverDiv.appendChild(gapSpan);
        driverDiv.appendChild(tyreSpan);

        classementDiv.appendChild(driverDiv);
    });

    isFirstTimeLoaded = false;
}

function updateRankings(newRankings) {
    const classementDiv = document.getElementById('Classement');
    const driverDivs = classementDiv.querySelectorAll('.driver');

    driverDivs.forEach(div => {
        const numberSpan = div.querySelector('.pilot-number');
        numberSpan.innerHTML = div.dataset.driverCode;
        numberSpan.classList.remove('arrow-up', 'arrow-down', 'fade-in', 'fade-out');
    });

    newRankings.forEach((driver, newIndex) => {
        const driverDiv = Array.from(driverDivs).find(div => div.dataset.driverCode == driver.driver_code);
        const oldIndex = Array.from(driverDivs).indexOf(driverDiv);
        if (oldIndex !== newIndex) {
            const movingUp = newIndex < oldIndex;
            const numberSpan = driverDiv.querySelector('.rank');
            numberSpan.innerHTML = movingUp ? '<img src="../img/live/arrow-up.png" class="fade-in">' : '<img src="../img/live/arrow-down.png" class="fade-in">';
            numberSpan.classList.add(movingUp ? 'arrow-up' : 'arrow-down');

            driverDiv.style.transform = `translateY(${(newIndex - oldIndex) * 100}%)`;
            setTimeout(() => {
            }, 1000);
        }
    });
}

async function mergeData(currentRankings, stintsArray, intervalsArray) {
    const currentStints = {};
    stintsArray.forEach(stint => {
        if (!currentStints[stint.driver_code] || currentStints[stint.driver_code].lap_end < stint.lap_end) {
            currentStints[stint.driver_code] = stint.compound;
        }
    });

    const intervalsObject = Array.isArray(intervalsArray) ? intervalsArray.reduce((acc, current) => {
        acc[current.driver_code] = current.gap;
        return acc;
    }, {}) : {};

    const result = currentRankings.map(driver => {
        const driverStint = currentStints[driver.driver_code];
        const driverInterval = intervalsObject[driver.driver_code];
        return {
            driver_code: driver.driver_code,
            compound: driverStint || 'UNKNOWN',
            interval: driverInterval || '0.000'
        };
    });
    return result;
}

async function initRankings() {
    try {
        currentRankings = await fetchDataRankings();
        const stintsArray = await fetchStintData();
        const intervalsArray = await fetchIntervalsData();
        const result = await mergeData(currentRankings, stintsArray, intervalsArray);
        renderRankings(result);
    } catch (error) {
        console.error("Erreur lors de la récupération des classements :", error);
    }
}


initRankings();

setInterval(async () => {
    currentRankings = await fetchDataRankings();
    const stintsArray = await fetchStintData();
    const intervalsArray = await fetchIntervalsData();
    updateRankings(currentRankings);
    const result = await mergeData(currentRankings, stintsArray, intervalsArray);
    console.log("updated");
    setTimeout(() => renderRankings(result), 2000);
}, 10000);