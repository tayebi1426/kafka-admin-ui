const serverUrl = "http://127.0.0.1:9901"

class KafkaClientService {

    static getClients(){
        return ['dms-logger','rasa-sso','communication','ihio']
    }
    static getAclList() {
        return fetch(`${serverUrl}/acl/filter`, {
            method: 'POST',
            headers: {
                Authorization: `Basic QWRtaW46QWRtaW5AMTIz`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        }).then(response => response.json())
    }

}


export default KafkaClientService