import axios from 'axios';

const ipURL = 'https://api.ipify.org/?format=json';

const GetIp = () => {
    return new Promise((resolve, reject) => {
        axios.get(ipURL).then(response => {
            resolve(response.data.ip);;
        }).catch(error => {
            resolve(false);
        });
    })
}

export default GetIp;