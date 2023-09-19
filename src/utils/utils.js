
export const formatDateToMMDDYYYY = function (millis) {
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