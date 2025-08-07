import axios from "axios"

const BACKEND_HOST = "http://172.16.16.202:8192"
// const BACKEND_HOST = "http://localhost:8192"

const request = axios.create({
  baseURL: BACKEND_HOST,
//   headers: {
//     "Content-Type": "application/json" 
//   }
})

request.interceptors.request.use(config => {
  // e.g. attach auth token if needed
  return config
}, error => {
  return Promise.reject(error)
})

request.interceptors.response.use(response => {
  return response.data
}, error => {
  return Promise.reject(error)
})

export default request
