import axios, { AxiosInstance } from 'axios';
import { ElMessage } from 'element-plus';
import { AxiosResponse } from 'axios'

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
interface CustomAPIResponse<T>  {
    code: number
    message: string
    data: T
}

export const loginRequest = <responseData = any, requestConfig = any>(data?: requestConfig) => {
    return service.request<CustomAPIResponse<responseData>, AxiosResponse<CustomAPIResponse<responseData>>,requestConfig>({
        url: `${ROOT}/login`,
        method: "POST",
        data: data
    })
}
export const registerRequest = <responseData = any, requestConfig = any>(data?: requestConfig) => {
    return service.request<responseData, AxiosResponse<responseData>,requestConfig>({
        url: `${ROOT}/register`,
        method: "POST",
        data: data
    })
}