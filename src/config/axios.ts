import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: process.env.BASE_URL ?? 'http://localhost:8080/'
})

export default axiosInstance