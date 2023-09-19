
export const formatDateToDDMMYYYY = function (millis) {
    if (isNaN(millis) || !millis) {
        millis = new Date().getTime()
    }
    let date = new Date(millis)
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export const generateRandomString = function (length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

export const getPageFromHash = function () {
    // Get the hash portion of the URL and remove the leading '#' character
    const hash = window.location.hash.slice(1);

// Split the hash into an array of key-value pairs
    const keyValuePairs = hash.split('&');

// Create an object to store the parsed key-value pairs
    const parsedData = {};

// Iterate through the key-value pairs and split each pair into a key and a value
    keyValuePairs.forEach((pair) => {
        const [key, value] = pair.split('=');
        // Decode URI components to handle special characters
        parsedData[key] = decodeURIComponent(value);
    });

    return (parsedData['page'] && parseInt(parsedData['page']) ) || 0

}

export const setPageInHash = function (page) {
    // Get the current hash
    const currentHash = window.location.hash.slice(1);

// Parse the current hash into an object
    const hashObject = currentHash
        ? currentHash.split('&').reduce((acc, pair) => {
            const [key, value] = pair.split('=');
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {})
        : {};

// Add or update key-value pairs
    hashObject.page = page;


// Convert the object back into a hash string
// Set the updated hash to window.location.hash
    window.location.hash = Object.entries(hashObject)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

}