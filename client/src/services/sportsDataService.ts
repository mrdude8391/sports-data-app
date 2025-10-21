import { STAT_INDEX } from './../constants/index';
import type { Athlete } from '@/types/Athlete';
import type { UserPayload, UserResponse } from './../types/User';
import type { AthleteStatResponse, Stat, StatForm, StatPayload, StatResponse,  } from "@/types/Stat"
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
        if (savedUser) {
            const user:UserResponse = JSON.parse(savedUser)
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
        const user:UserResponse = {
            _id: res.data._id,
            username: res.data.username,
            email: res.data.email,
            token: res.data.token,
        }
        return user
    } catch (error: any) {
        console.log(error.response.data.message)
        throw new Error(error.response?.data?.message || "Login Failed")
    }
    

}

export const register = async ({username, email, password} : UserPayload) => {
    try {
        const res = await api.post("/auth/register", {username, email, password})
        const user:UserResponse = {
            _id: res.data._id,
            username: res.data.username,
            email: res.data.email,
            token: res.data.token,
        }
        console.log(user)
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
        const user:UserResponse = {
            _id: res.data._id,
            username: res.data.username,
            email: res.data.email,
            token: res.data.token,
        }
        return user
    } catch (error : any) {
        throw new Error(error.response.data.message)
        console.log(error.response.data.message)
    }
}

export const getAthletes = async () : Promise<Athlete[]> => {
    try {
        console.log("Get Athletes")
        const {data} = await api.get("/athlete/")
        return data
    } catch (error:any) {
        throw new Error(error.response.data.message)
    }
}

export const createAthlete = async (athlete : {name:string, age: number, height: number}) : Promise<Athlete> => {
    try {
        console.log("create athlete", athlete)
        const {data} = await api.post("/athlete/create", athlete)
        return data
    } catch (error:any) {
        throw new Error(error.response.data.message)
    }
}

export const deleteAthlete = async (id: string) => {
    try {
        console.log("delete athlete", id)
        await api.delete(`/athlete/${id}`)
    } catch (error:any) {
        throw new Error(error.response.data.message)
    }
}

export const createStat = async ({athleteId, form, date} : {athleteId: string, form: StatForm, date: Date}) => {
    try {
        console.log("create stat", form)
        const payload: StatPayload = { ...form, recordedAt: date}
        const { data } = await api.post(`/athlete/${athleteId}/stats`, payload) 
        return data
    } catch (error: any) {
        
        throw new Error(error.response.data.message)
    }
}

export const editStat = async (req : {statId: string, form: StatForm, date: Date}) => {
    try {
        console.log("edit stat", req.form)
        const payload = { ...req.form, recordedAt: req.date}
        const { data } = await api.patch(`/athlete/${req.statId}/stats`, payload) 
        return data
    } catch (error: any) {
        
        throw new Error(error.response.data.message)
    }
}

export const getStats = async (id: string) : Promise<AthleteStatResponse> => {
    try {
        console.log("Get Stats for: ", id)
        const {data} = await api.get<AthleteStatResponse>(`/athlete/${id}/stats`)
        const stats : StatResponse[] = data.stats.map((stat: any) => ({
            ...stat,
            recordedAt: new Date(stat.recordedAt),
            createdAt: new Date(stat.createdAt),
            updatedAt: new Date(stat.updatedAt),
        }))
        const athlete = data.athlete
        return {athlete, stats};
    } catch (error:any) {
        if(error.status === 500) {
            throw new Error("There was an error retreiving the data")
        }
        throw new Error(error.response.data.message)
    }
}

export const deleteStat = async (statId : string) => {
    try {
        console.log("delete stat", statId)
        await api.delete(`/athlete/${statId}/stats`)
    } catch (error:any) {
        throw new Error(error.response.data.message)
    }
}
