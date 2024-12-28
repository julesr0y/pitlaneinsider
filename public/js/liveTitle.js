/**
 * @function updateSessionInfo
 * @description Met à jour les informations de la session en cours
 */
function updateSessionInfo() {
    fetch('https://api.openf1.org/v1/sessions?session_key=latest')
        .then(response => response.json())
        .then(data => {
            data = data.reverse();
            data = data[0];
            session_type = data.session_type;
            var countryName = data.country_name.toLowerCase().replace(/ /g, '-'); // lower case and replace space by '-'
            frontLocation.innerHTML = `<img src="/img/countryFlags/${countryName}.svg" alt="${data.country_name}" class="h-6 w-auto">`;
            frontSession.textContent = data.session_name;
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
}

updateSessionInfo();