const options = { // On définit les options de la requête
    method: 'GET', // On définit la méthode HTTP
    headers: { // On définit les en-têtes de la requête
        'Content-Type': 'application/json', // On définit le type de contenu
    },
};

/**
    * @function
    * @description Fonction permettant de récupérer des données depuis l'API OpenF1
    * @param {string} endpoint - Fin de l'adresse de la requête à l'API
    * @returns {Promise} - Promesse contenant la réponse de l'API
    */
async function getFromOpenF1(endpoint) {
    var url = 'https://api.openf1.org/v1/' + endpoint; // On définit l'URL de l'API, avec l'endpoint en paramètre
    return fetch(url, options) // On effectue la requête
        .then((response) => { // On récupère la réponse
            return response.json(); // On retourne la réponse en JSON
        })
        .catch((error) => { // En cas d'erreur
            console.log(
                "Il y a eu un problème avec l'opération fetch: " + error.message
            ); // On affiche un message d'erreur
        });
}

module.exports = getFromOpenF1;