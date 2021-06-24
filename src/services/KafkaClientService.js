const serverUrl = "http://127.0.0.1:9901"

const AUTH_TOKEN='QWRtaW46QWRtaW5AMTIz'
const REQUEST_HEADERS={
    Authorization: `Basic ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
}
class KafkaClientService {

    static getPrincipals(){
        return fetch(`${serverUrl}/truststore/list`, {
            method: 'GET',
            headers: {Authorization: `Basic ${AUTH_TOKEN}`},
        }).then(response => response.json())
    }
    static getAclList() {
        return fetch(`${serverUrl}/acl/filter`, {
            method: 'POST',
            headers: REQUEST_HEADERS,
            body: JSON.stringify({})
        }).then(response => response.json())
    }

    static addAclEntry({clientGroup,...aclEntry}) {

        return fetch(`${serverUrl}/acl/${clientGroup==='PRODUCER' ? 'addProducerAcl' : 'addConsumerAcl'}`, {
            method: 'POST',
            headers: REQUEST_HEADERS,
            body: JSON.stringify(aclEntry)
        }).then(response => response.json())
    }
    static deleteAclEntry(aclEntry) {
        return fetch(`${serverUrl}/acl`, {
            method: 'DELETE',
            headers: REQUEST_HEADERS,
            body: JSON.stringify(aclEntry)
        }).then(response => response.json())
    }

}


export default KafkaClientService