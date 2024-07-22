var weatherdata = document.getElementById("weatherdata"); // On récupère l'élément avec l'id weatherdata
var track_temp = document.getElementById("track_temp"); // On récupère l'élément avec l'id track_temp
var air_temp = document.getElementById("air_temp"); // On récupère l'élément avec l'id air_temp
var rain_fall = document.getElementById("rain_fall"); // On récupère l'élément avec l'id rainfall
var wind_speed = document.getElementById("wind_speed"); // On récupère l'élément avec l'id wind_speed

/**
    * @function updateWeather
    * @description Fonction pour récupérer et mettre à jour les données de météo
    * @returns {void}
    */
function updateWeather() {
    // Effectuer une requête AJAX pour récupérer les données du serveur
    fetch('https://api.openf1.org/v1/weather?session_key=latest')
        .then(response => response.json())
        .then(data => {
            data = data.reverse(); // On inverse l'ordre des données pour récuérer le dernier élément en premier
            data = data[0]; // On récupère le premier élément du tableau (le dernier élément)
            air_temp.textContent = "AT: " + data.air_temperature + "°C"; // On met à jour la température de l'air
            track_temp.textContent = "TT: " + data.track_temperature + "°C"; // On met à jour la température de la piste
            rain_fall.textContent = "RF: " + data.rainfall + "%"; // On met à jour la quantité de pluie
            wind_speed.textContent = "WS: " + data.wind_speed + "km/h"; // On met à jour la vitesse du vent
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
}

updateWeather();
setInterval(updateWeather, 60000);