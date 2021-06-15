import querystring from "querystring";
import XhrRequest from "../util/XhrRequest";
import AuthTokenStorage from "./AuthTokenStorage";

const OAUTH_SRV_TOKEN_URL = process.env.REACT_APP_AUTH_SERVER_URL;
const AUTH_CLIENT_USERNAME = process.env.REACT_APP_AUTH_CLIENT_USERNAME;
const AUTH_CLIENT_PASSWORD = process.env.REACT_APP_AUTH_CLIENT_PASSWORD;


const FORM_URLENCODED = 'application/x-www-form-urlencoded';

const BASIC_AUTH_HEADERS = {
    'Content-Type': FORM_URLENCODED,
    'Authorization': 'Basic ' + btoa(AUTH_CLIENT_USERNAME + ':' + AUTH_CLIENT_PASSWORD)
};

const ACCESS_TOKEN_SCHEMA = {
    accessToken: 'access_token',
    expiration: 'exp',
    authorities: "authorities"
}

class OAuthProvider {

    takeToken = (username, password) => {
        this.cleanStage();
        let data = querystring.encode({'grant_type': 'password', username, password});
        return XhrRequest.post(OAUTH_SRV_TOKEN_URL, data, BASIC_AUTH_HEADERS)
            .then(this.handleSuccessAuth).catch(this.handleFailureAuth);
    }
    handleSuccessAuth = (token) => {
        AuthTokenStorage.persistToken(token);
        return token;
    }
    handleFailureAuth = (error) => {
        let errorMessage;
        if (!error.response) {
            errorMessage = 'error.network_connection';
        } else if (error.response.status === 400) {
            errorMessage = 'error.invalid_grant';
        } else {
            errorMessage = 'error.unhandled_error';
        }
        return Promise.reject(errorMessage);
    }

    logout = () => {
        this.cleanStage();
    }

    cleanStage = () => {
        AuthTokenStorage.removeToken();
    }

    getUser = () => {
        let currentUser = this.extractTokenPayload();
        if (this.isUserExpired(currentUser)) {
            throw 'the token expired';
        }
        return currentUser;
    }

    getUserAccessToken = () => {
        return this.getUser()[ACCESS_TOKEN_SCHEMA.accessToken];
    }
    getUserAuthorities = () => {
        return this.getUser()[ACCESS_TOKEN_SCHEMA.authorities];
    }

    extractTokenPayload() {
        let token = AuthTokenStorage.getToken();
        let accessToken = token[ACCESS_TOKEN_SCHEMA.accessToken];
        const payload = accessToken.split('.')[1];
        let jsonPayload = JSON.parse(atob(payload));
        jsonPayload[ACCESS_TOKEN_SCHEMA.accessToken] = accessToken;
        return jsonPayload;
    }

    isUserExpired(currentUser) {
        if (!currentUser) {
            return false;
        }
        let exp = currentUser[ACCESS_TOKEN_SCHEMA.expiration]
        let expirationTime = parseInt(exp, 10) * 1000
        return expirationTime < new Date().getTime();
    }
}

export default OAuthProvider;