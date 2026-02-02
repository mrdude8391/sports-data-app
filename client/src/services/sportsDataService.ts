import type { Athlete } from '@/types/Athlete';
import type { AthleteStatResponse, StatForm, StatPayload, StatResponse,  } from "@/types/Stat"
import axios, { AxiosError } from "axios";
import type { LoginPayload, AuthResponse, RegisterPayload } from '@/types/Auth';

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
            const user:AuthResponse = JSON.parse(savedUser)
            config.headers.Authorization = `Bearer ${user.token}`
        }
        return config
    }, (error: AxiosError) => { 
        console.log(error)
        return Promise.reject(error)}
)

api.interceptors.response.use((response) => {
    return response
},
(error: AxiosError) => {
    console.error("Axios Interceptor Response", error)
    if (error.response && error.status === 401){
        console.log("Error 401: Unauthorized token. Clearing local storage token")
        logoutCallback()
    }
    return Promise.reject(error)
}

)

export const test = async() => {
    try {
        const res = await api.get("/test");
        console.log("API Test Service", res)
        return res
    } catch (error: any) {
        console.log("API Test Service", error)
        throw new Error(error.response?.data?.detail || "Test Failed")
    }
}

export const login = async (loginInfo: LoginPayload) => {
    try {
        const res = await api.post<AuthResponse>("/auth/login", loginInfo )
        const user : AuthResponse = res.data
        return user
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || "Login Failed")
    }
}

export const register = async (registerInfo : RegisterPayload) => {
    try {
        const res = await api.post("/auth/register", registerInfo)
        const user:AuthResponse = res.data
        console.log("register user response" , user)
        localStorage.setItem("token", user.token)
        return user
    } catch (error: any) {
        console.log(error)
        throw new Error(error.response?.data?.detail || "Registration Failed")
    }
}

export const profile = async () => {
    try {
        console.log("profile call")
        const res = await api.get("/auth/profile")
        console.log("profile response")
        const user : AuthResponse = res.data
        return user
    } catch (error : any) {
        throw new Error(error.response.data.detail)
        console.log(error.response.data.detail)
    }
}

export const getAthletes = async () : Promise<Athlete[]> => {
    try {
        console.log("Get Athletes")
        const {data} = await api.get<Athlete[]>("/athlete/")
        return data
    } catch (error:any) {
        throw new Error(error.response.data.detail)
    }
}

export const createAthlete = async (athlete : {name:string, age: number, height: number}) : Promise<Athlete> => {
    try {
        console.log("Create athlete", athlete)
        const {data} = await api.post<Athlete>("/athlete/create", athlete)
        return data
    } catch (error:any) {
        throw new Error(error.status + ": " + error.response.data.detail)
    }
}

export const deleteAthlete = async (id: string) => {
    try {
        console.log("delete athlete", id)
        await api.delete(`/athlete/${id}`)
    } catch (error:any) {
        throw new Error(error.response.data.detail)
    }
}

export const createStat = async ({athleteId, form, date} : {athleteId: string, form: StatForm, date: Date}) => {
    try {
        console.log("create stat", form)
        const payload: StatPayload = { ...form, recordedAt: date}
        const { data } = await api.post(`/athlete/${athleteId}/stats`, payload) 
        return data
    } catch (error: any) {
        throw new Error(error.response.data.detail)
    }
}

export const createStatsBatch = async({forms} : {forms : Map<string, StatForm>}) => {
    try {
        console.log("create stats batch")
        const payload = Array.from(forms.entries()).map(([id, form]) => ({athleteId: id, ...form}))
        // Form.entries turns the map into an iterable tuple.
        // array from turns the iterator into an array of tuples
        // map generates an array of objects => callback function turns every tuple into an object. 
        const { data } = await api.post(`/athlete/stats`, payload)
        return data
    } catch (error: any) {
        throw new Error(error.response.data.detail)
    }
}

export const editStat = async (req : {statId: string, form: StatForm, date: Date}) => {
    try {
        console.log("edit stat", req.form)
        const payload = { ...req.form, recordedAt: req.date}
        const { data } = await api.patch(`/athlete/${req.statId}/stats`, payload) 
        return data
    } catch (error: any) {
        
        throw new Error(error.response.data.detail)
    }
}

export const getStats = async (id: string) : Promise<AthleteStatResponse> => {
    try {
        console.log("Get Stats for: ", id)
        // Need to add a check for ID to be mongodb ObjectID
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
        throw new Error(error.response.data.detail)
    }
}

export const deleteStat = async (statId : string) => {
    try {
        console.log("delete stat", statId)
        await api.delete(`/athlete/${statId}/stats`)
    } catch (error:any) {
        throw new Error(error.response.data.detail)
    }
}
