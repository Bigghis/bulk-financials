export const getYear = (isoStringDate) => {
    const _date = new Date(isoStringDate);
    return _date.getFullYear();
}
