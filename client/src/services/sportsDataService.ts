import type { User } from './../types/User';
import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    }, (error) => { 
        console.log(error)
        return Promise.reject(error)}
)

api.interceptors.response.use((response) => {
    
    return response
},
(error) => {
    if (error.response && error.response.status === 401){
        console.log("error 401 unauthorized token, clearing token")
        localStorage.removeItem("token")
    }
    return Promise.reject(error)
}

)

export const login = async (email: string, password: string) => {
    try {
        const res = await api.post("/auth/login", {email, password} )
        const user:User = {
            username: res.data.username,
            email: res.data.email,
            token: res.data.token
        }
        localStorage.setItem("token", user.token)
        return user
    } catch (error: any) {
        console.log(error.response.data.message)
        throw new Error(error.response?.data?.message || "Login Failed")
    }
    

}

export const register = async (username: string, email: string, password: string) => {
    try {
        const res = await api.post("/auth/register", {username, email, password})
        const user:User = {
            username: res.data.username,
            email: res.data.email,
            token: res.data.token,
        }
        localStorage.setItem("token", user.token)
        return user
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Registration Failed")
    }
}

export const profile = async() => {
    try {
        console.log("profile call")
        const res = await api.get("/auth/profile")
        console.log("profile response")
        const user: User = {
            username: res.data.username,
            email: res.data.email,
            token: res.data.token
        }
        return user
    } catch (error : any) {
        throw new Error(error.response.data.message)
        console.log(error.response.data.message)
    }
}
