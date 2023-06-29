import axios, { AxiosInstance } from 'axios';
import { ElMessage } from 'element-plus';

const TIMEOUT:number = 30000;
const ROOT:string = '/_data/api'
const RESPONSE_CODE_TABLE = {
    "SUCCESS": 0,
    "AUTH_FAIL": 401
}
const service: AxiosInstance = axios.create({
    headers: { 'Content-Type': 'application/json' },
    timeout: TIMEOUT,
});


service.interceptors.response.use(
    function (res) {
        if (res.data.code !== RESPONSE_CODE_TABLE.SUCCESS) {
           
            ElMessage({
                message: res.data.message,
                type: 'error',
            });
        } else {
            ElMessage({
                message: res.data.message,
                type: 'success',
            });
        }
        return res;
    },
    function (error) {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.log('Unauthorized!!');
                    break;
                case 403:
                    console.log('token過期');
                    break;
                case 404:
                    console.log('page not found!');
                    break;
                case 500:
                    console.log('server error');
                    break;
                default:
                    console.log(error.message);
            }
        }
        return Promise.reject(error);
    }
);

export const loginRequest = (data: object = {}) => {
    return service.request({
        url: `${ROOT}/login`,
        method: "POST",
        data: data
    })
}
export const registerRequest = (data: object = {}) => {
    return service.request({
        url: `${ROOT}/register`,
        method: "POST",
        data: data
    })
}