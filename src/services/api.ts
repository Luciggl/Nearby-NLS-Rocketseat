import axios, { Axios } from "axios";

export const api = axios.create({
    baseURL: "http://192.168.3.77:3333",
    timeout: 700,
})