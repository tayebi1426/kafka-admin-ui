const serverUrl = process.env.REACT_APP_SERVER_URL
const AUTH_TOKEN_KEY = "AUTH_TOKEN"

class SecurityService {

    static logout() {
        sessionStorage.removeItem(AUTH_TOKEN_KEY)
    }

    static login({username, password}) {
        const token = btoa(username + ":" + password);
        return fetch(`${serverUrl}/user`, {
            method: 'GET',
            headers: {
                Authorization: `Basic ${token}`
            }
        })
    }
    static isAuthenticated() {
        let authToken = SecurityService.getAuthToken();
        return !!(authToken)
    }

    static hasAuthority() {
        return true
    }

    static getAuthToken() {
        return sessionStorage.getItem(AUTH_TOKEN_KEY)
    }

    static setAuthToken(token) {
        return sessionStorage.setItem(AUTH_TOKEN_KEY, token)
    }
}

export default SecurityService