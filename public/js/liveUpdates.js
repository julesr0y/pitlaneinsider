var racecontrol = document.getElementById("RaceControl"); // On récupère l'élément avec l'id racecontrol

/**
    * @function updateRcAndLs
    * @description Fonction pour récupérer et mettre à jour les données de race control
    * @returns {void}
    */
function updateRcAndLs() {
    fetch('https://api.openf1.org/v1/race_control?session_key=latest')
        .then(response => response.json())
        .then(data => {
            // On met à jour le contenu de la div racecontrol
            // On commence par vider la div (car on va la remplir entièrement à chaque fois)
            racecontrol.innerHTML = ''; // On vide la div racecontrol

            data.reverse().forEach(element => { // On parcourt les éléments du tableau data (on les parcourt dans l'ordre inverse pour afficher les derniers éléments en premier)
                const span = document.createElement('span'); // On crée un élément span
                span.classList.add('message'); // On ajoute la classe message à l'élément span
                if (element.flag === null) {
                    span.classList.add('bg-stewardsBg', 'text-stewardsTxt', 'text-center', 'font-bold', 'py-4', 'px-6', 'rounded-3xl', 'my-3', 'w-3/4', 'md:w-1/2', 'border-2', 'border-stewardsTxt'); // On ajoute des classes à l'élément span
                }
                else if (element.flag === "GREEN" || element.flag === "CLEAR") {
                    span.classList.add('bg-green-400', 'text-white', 'text-center', 'font-F1Bold', 'py-4', 'px-6', 'rounded-3xl', 'my-3', 'w-3/4', 'md:w-1/2');
                }
                else if (element.flag.includes("YELLOW")) {
                    span.classList.add('bg-yellow-300', 'text-black', 'text-center', 'font-F1Bold', 'py-4', 'px-6', 'rounded-3xl', 'my-3', 'w-3/4', 'md:w-1/2');
                }
                else if (element.flag === "RED") {
                    span.classList.add('bg-red-500', 'text-white', 'text-center', 'font-F1Bold', 'py-4', 'px-6', 'rounded-3xl', 'my-3', 'w-3/4', 'md:w-1/2');
                }
                else if (element.flag === "BLUE") {
                    span.classList.add('bg-blue-500', 'text-white', 'text-center', 'font-F1Bold', 'py-4', 'px-6', 'rounded-3xl', 'my-3', 'w-3/4', 'md:w-1/2');
                }
                else if (element.flag === "CHEQUERED" || element.flag === "BLACK AND WHITE") {
                    span.classList.add('bg-white', 'text-black', 'text-center', 'font-F1Bold', 'py-4', 'px-6', 'rounded-3xl', 'my-3', 'w-3/4', 'md:w-1/2', 'border-2', 'border-black');
                }
                span.textContent = element.message; // On ajoute le texte (message) de l'élément à l'élément span
                racecontrol.appendChild(span); // On ajoute l'élément span à la div racecontrol
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
}

/**
 * @function updateLaps
 * @description Fonction pour récupérer et mettre à jour le nombre de tours
 * @returns {void}
 */
function updateLaps() {
    fetch('https://api.openf1.org/v1/laps?session_key=latest')
        .then(response => response.json())
        .then(data => {
            data = data.reverse(); // On inverse l'ordre des données pour récuérer le dernier élément en premier

            // Vérifiez si les données sont valides et si lap_number existe
            if (data && data.length > 0 && data[0].lap_number !== undefined) {
                const laps = data[0].lap_number; // Récupère le nombre de tours du dernier élément

                // Affichez le nombre de tours dans l'élément HTML avec l'id 'lap'
                const lapElement = document.getElementById('lap');
                if (lapElement) {
                    lapElement.textContent = `Tour ${laps}`;
                }
            } else {
                console.error('Les données de tours reçues sont invalides.');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données de tours:', error);
        });
}



// appel et mise à jour périodique
updateRcAndLs();
updateLaps();
setInterval(updateRcAndLs, 10000);
setInterval(updateLaps, 10000);
