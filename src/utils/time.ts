export const formatTimestampToYYYYMMDD = (ISOTimestamp:string) => {
    const date = new Date(ISOTimestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

export const formatTimestampToMMDD = (ISOTimestamp:string) => {
    const date = new Date(ISOTimestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${month}-${day}`;
    return formattedDate;
}