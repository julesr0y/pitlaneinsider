var currentRankings = []

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

let currentFirstPlaceDriverId = null;

function renderRankings(rankings) {
    const classementDiv = document.getElementById('Classement');

    const children = Array.from(classementDiv.children).slice(1);
    children.forEach(child => classementDiv.removeChild(child));

    rankings.forEach((driver, index) => {
        const driverDiv = document.createElement('div');
        driverDiv.className = 'grid grid-cols-2 justify-center items-center driver move';
        driverDiv.dataset.driverCode = driver.driver_code;

        if (index === 0) {
            if (currentFirstPlaceDriverId !== driver.driver_code) {
                driverDiv.classList.add('first-place');
                currentFirstPlaceDriverId = driver.driver_code;
            }
        }

        const rankSpan = document.createElement('span');
        rankSpan.className = 'rank font-F1Bold';
        rankSpan.textContent = `${(index + 1).toString().padStart(2, '0')}`;

        const numberSpan = document.createElement('span');
        numberSpan.className = 'pilot-number';
        numberSpan.textContent = driver.driver_code;

        driverDiv.appendChild(rankSpan);
        driverDiv.appendChild(numberSpan);

        classementDiv.appendChild(driverDiv);
    });
}

function updateRankings(newRankings) {
    const classementDiv = document.getElementById('Classement');
    const driverDivs = classementDiv.querySelectorAll('.driver');

    driverDivs.forEach(div => {
        const numberSpan = div.querySelector('.pilot-number');
        numberSpan.innerHTML = div.dataset.driverCode;
        numberSpan.classList.remove('arrow-up', 'arrow-down');
    });

    newRankings.forEach((driver, newIndex) => {
        const driverDiv = Array.from(driverDivs).find(div => div.dataset.driverCode == driver.driver_code);
        const oldIndex = Array.from(driverDivs).indexOf(driverDiv);
        if (oldIndex !== newIndex) {

            const movingUp = newIndex < oldIndex;
            const numberSpan = driverDiv.querySelector('.rank');
            numberSpan.innerHTML = movingUp ? '<img src="img/live/arrow-up.png">' : '<img src="img/live/arrow-down.png">';
            numberSpan.classList.add(movingUp ? 'arrow-up' : 'arrow-down');

            driverDiv.style.transform = `translateY(${(newIndex - oldIndex) * 100}%)`;
            setTimeout(() => {
                driverDiv.style.transform = 'translateY(0)';
                classementDiv.insertBefore(driverDiv, classementDiv.children[newIndex + 1] || null);
            }, 2000);
        }
    });
}

async function initRankings() {
    try {
        currentRankings = await fetchDataRankings();
        renderRankings(currentRankings);
    } catch (error) {
        console.error("Erreur lors de la récupération des classements :", error);
    }
}

initRankings();

setInterval(async () => {
    currentRankings = await fetchDataRankings();
    updateRankings(currentRankings);
    console.log("updated");
    setTimeout(() => renderRankings(currentRankings), 2000);
}, 10000);