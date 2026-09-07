const ACCESS_TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"

export function getToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY) ?? "";
}
export function setToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
}
export function removeToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY) ?? "";
}
export function setRefreshToken(token: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
}
export function removeRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
}