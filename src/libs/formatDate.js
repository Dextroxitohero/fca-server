export const formatDate = (inputDate) => {
    if (!inputDate) {
        return "";
    }
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const date = new Date(inputDate);
    return date.toLocaleDateString('es-ES', options);
}