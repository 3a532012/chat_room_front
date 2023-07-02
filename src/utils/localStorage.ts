export const saveLocalStorage = (key: string, value:any) => {
    window.localStorage.setItem(key, value)
}
export const deleteLocalStorage = (key: string) => {
    window.localStorage.removeItem(key)
}
export const updateLocalStorage = (key: string, value:any) => {
    window.localStorage.removeItem(key)
    window.localStorage.setItem(key, value)
}
export const getLocalStorage = (key: string) => {
    return window.localStorage.getItem(key)
}