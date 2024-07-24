/*
const driverLocationsMapping = {
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

const X = {};
const Y = {};
const Z = {};

async function fetchLocation(driverNumber) {
    try {
        const response = await fetch(`https://api.openf1.org/v1/location?session_key=latest&driver_number=${driverNumber}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.reverse(); // Inverser les données pour obtenir les informations les plus récentes en premier
    } catch (error) {
        console.error(`Erreur lors de la récupération de la localisation du pilote ${driverNumber}:`, error);
        return [];
    }
}

async function updateDriverLocations() {
    const drivers = Object.keys(driverLocationsMapping);
    for (const driverNumber of drivers) {
        const locationData = await fetchLocation(driverNumber);
        if (locationData.length > 0) {
            const latestLocation = locationData[0]; // Prendre le premier élément après inversion
            X[driverNumber] = latestLocation.x; // Récupérer la coordonnée x
            Y[driverNumber] = latestLocation.y; // Récupérer la coordonnée y
            Z[driverNumber] = latestLocation.z; // Récupérer la coordonnée z

            console.log(`Driver ${driverNumber}: x=${X[driverNumber]}, y=${Y[driverNumber]}, z=${Z[driverNumber]}`);
        }
    }
    renderDriverLocations();
}

function renderDriverLocations() {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) {
        console.error('Element with ID "mapContainer" not found');
        return;
    }
    mapContainer.innerHTML = ''; // Nettoyer les anciens points

    for (const driverNumber in driverLocationsMapping) {
        if (X[driverNumber] !== undefined && Y[driverNumber] !== undefined) { // Vérifiez que les valeurs existent
            const leftPercentage = convertToPercentage(X[driverNumber]);
            const topPercentage = convertToPercentage(Y[driverNumber]);

            console.log(`Rendering Driver ${driverNumber} at left: ${leftPercentage}%, top: ${topPercentage}%`);

            const driverPoint = document.createElement('div');
            driverPoint.classList.add('driver-point');
            driverPoint.style.left = `${leftPercentage}%`;
            driverPoint.style.top = `${topPercentage}%`;
            driverPoint.title = driverLocationsMapping[driverNumber];

            // Créer un élément pour afficher le numéro ou les initiales du pilote
            const textElement = document.createElement('span');
            textElement.classList.add('driver-text');
            textElement.textContent = driverNumber; // Affiche le numéro du pilote
            driverPoint.appendChild(textElement);

            mapContainer.appendChild(driverPoint);
        } else {
            console.log(`No coordinates for driver ${driverNumber}`);
        }
    }
}

function convertToPercentage(value) {
    // Conversion d'une valeur de coordonnées en pourcentage
    return ((value + 1500) / 3000) * 100; // Ajustez ces valeurs selon l'échelle de vos coordonnées
}

// Ajout dynamique du style
const style = document.createElement('style');
style.textContent = `
#mapContainer {
    position: relative;
    width: 100vw; 
    height: 100vh; 
    background-color: #f0f0f0; 
}

.driver-point {
    position: absolute;
    width: 30px; 
    height: 30px; 
    background-color: rgba(255, 0, 0, 0.7); 
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
}

.driver-text {
    font-size: 12px;
    text-align: center;
}
`;
document.head.appendChild(style);

// Initialisation de la mise à jour des localisations
updateDriverLocations();
setInterval(updateDriverLocations, 10000);

*/