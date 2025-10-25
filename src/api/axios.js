import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/", // Cambialo si tu backend corre en otro puerto
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
