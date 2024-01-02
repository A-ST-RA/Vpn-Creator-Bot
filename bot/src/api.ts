import axios from "axios";
import { appConfig } from "./config";

const api = axios.create({
  baseURL: appConfig.backendUrl,
});

export default api;