import axios from "axios";
import { appConfig } from "./config";

export const backendApi = axios.create({
  baseURL: appConfig.backendUrl,
});

export const vpnApi = axios.create({
  baseURL: appConfig.vpnUrl,
});
