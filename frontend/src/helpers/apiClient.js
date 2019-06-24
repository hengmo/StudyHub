import axios from 'axios';

const apiUrl = 'https://api.studyhub.xyz';
const methods = ['get', 'post', 'put', 'delete'];

function formatUrl(path) {
  return `${apiUrl}${path}`;
}

class ApiClient {
  constructor() {
    methods.forEach((method) => {
      this[method] = (path, data) => new Promise((resolve, reject) => {
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
          reject({statusCode : response.status, message: response.data});
        });
      });
      return this[method];
    });
  }
}

export default new ApiClient();

export { apiUrl };

