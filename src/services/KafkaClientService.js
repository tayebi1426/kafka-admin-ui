import SecurityService from "./SecurityService";

const serverUrl = process.env.REACT_APP_SERVER_URL

const JSON_CONTENT_TYPE_HEADER = {'Content-Type': 'application/json'}

class KafkaClientService {

    static getPrincipals() {
        let authorizeHeader = KafkaClientService.getAuthorizeHeader();
        return fetch(`${serverUrl}/truststore/list`, {
            method: 'GET',
            headers: authorizeHeader,
        }).then(response => response.json())
    }

    static getAclList() {
        let headers= KafkaClientService.getJsonRequestHeaders();
        console.log('requestHeader ',headers)
        return fetch(`${serverUrl}/acl/filter`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({})
        }).then(response => response.json())
    }

    static addAclEntry({clientGroup, ...aclEntry}) {
        let headers= KafkaClientService.getJsonRequestHeaders();
        return fetch(`${serverUrl}/acl/${clientGroup === 'PRODUCER' ? 'addProducerAcl' : 'addConsumerAcl'}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(aclEntry)
        }).then(response => response.json())
    }

    static deleteAclEntry(aclEntry) {
        let headers= KafkaClientService.getJsonRequestHeaders();
        return fetch(`${serverUrl}/acl`, {
            method: 'DELETE',
            headers: headers,
            body: JSON.stringify(aclEntry)
        }).then(response => response.json())
    }

    static getJsonRequestHeaders() {
        let authToken = KafkaClientService.getAuthorizeHeader();
        return {
            ...authToken,
            ...JSON_CONTENT_TYPE_HEADER
        }
    }
    static getAuthorizeHeader() {
        const AUTH_TOKEN = SecurityService.getAuthToken()
        if(!AUTH_TOKEN){
            console.log("authToken is invalid > ",AUTH_TOKEN)
            throw new Error('token is invalid')
        }
        return {Authorization: `Basic ${AUTH_TOKEN}`}
    }

}


export default KafkaClientService