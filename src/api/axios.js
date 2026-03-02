import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // change if needed
  withCredentials: true, // VERY IMPORTANT (cookies)
});

export default api;
