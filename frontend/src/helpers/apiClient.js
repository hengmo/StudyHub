import axios from 'axios';

const apiUrl = 'http://18.216.236.158/api';
const methods = ['get', 'post', 'put', 'delete'];

function formatUrl(path) {
  return `${apiUrl}${path}`;
}

class ApiClient {
  constructor() {
    methods.forEach((method) => {
      this[method] = (path, data, config) => new Promise((resolve, reject) => {
          axios({
            method: method,
            url: formatUrl(path),
            data: data,
            withCredentials: true,
          })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            const response = err.response;
            reject({statusCode : response.status, ...response.data});
          });
      });
      return this[method];
    });
  }
}

export default new ApiClient();

export { apiUrl };