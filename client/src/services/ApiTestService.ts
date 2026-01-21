import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
    baseURL: API_URL
});

export const test = async() => {
    try {
        const res = await api.get("/test");
        console.log("API Test Service", res)
        return res
        
    } catch (error: any) {
        console.log(error.response.data.message)
        throw new Error(error.response?.data?.message || "Test Failed")
    }
}