import axios from "axios"

const AXIOS_INSTANCE = axios.create({
    baseURL: "http://127.0.01:8080",
})

AXIOS_INSTANCE.interceptors.request.use((config)=>{
    const token = window.localStorage.getItem("token")
    console.log("token: " + token)
    if(token){
        config.headers.Authorization = `Bearer ${token}`
        config.headers.Accept = `application/json`
    }
    return config
},(error)=>{
    return Promise.reject(error)
})

export default AXIOS_INSTANCE