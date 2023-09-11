export const formatDateToMMDDYYYY = function (millis) {
    if (isNaN(millis)) {
        millis = new Date().getTime()
    }
    let date = new Date(millis)
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}