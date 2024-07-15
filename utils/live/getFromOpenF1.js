const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
};

/**
 * @description Get requested data (with the endpoint) from OpenF1 API
 * @async
 * @param {String} endpoint 
 * @returns {Array}
 */
async function getFromOpenF1(endpoint) {
    var url = 'https://api.openf1.org/v1/' + endpoint;
    return fetch(url, options)
        .then((response) => {
            return response.json();
        })
        .catch((error) => {
            console.log(
                "Il y a eu un problème avec l'opération fetch: " + error.message
            );
        });
}

module.exports = getFromOpenF1;