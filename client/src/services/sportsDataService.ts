import type { User } from './../types/User';
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
    baseURL: API_URL
});

let logoutCallback: () => void | null;

export const setLogoutCallback = (cb: () => void) => {
    logoutCallback = cb
}

api.interceptors.request.use(
    (config) => {
        const savedUser = localStorage.getItem("user")
        console.log("inteceptor saved user", savedUser)
        if (savedUser) {
            const user:User = JSON.parse(savedUser)
            config.headers.Authorization = `Bearer ${user.token}`
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
        logoutCallback()
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

export const profile = async () => {
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

export const getAthletes = async () => {
    try {
        console.log("Get Athletes")
        const res = await api.get("/athlete/")
        const athletes = res.data
        return athletes
    } catch (error:any) {
        throw new Error(error.response.data.message)
    }
}
