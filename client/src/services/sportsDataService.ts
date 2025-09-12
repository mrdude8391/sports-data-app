import type { User } from './../types/User';
import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL

export const login = async (email: String, password: String) => {
    try {
        const res = await axios.post(API_URL + '/auth/login', {email, password} )
        const user:User = {
            username: res.data.username,
            email: res.data.email,
            token: res.data.token
        }
        return user
    } catch (error: any) {
        console.log(error.response.data.message)
    }
    

}

