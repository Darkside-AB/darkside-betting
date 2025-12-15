import axios from "axios";
import type {
  EuropatipsetDrawsResponse,
  EuropatipsetResultsResponse,
  StryktipsetDrawsResponse,
  StryktipsetResultsResponse,
} from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

export const couponApi = {
  getEuropatipsetDraws() {
    return api.get<EuropatipsetDrawsResponse>("/europatipset/draws");
  },

  getEuropatipsetResults() {
    return api.get<EuropatipsetResultsResponse>("/europatipset/results");
  },

  getStryktipsetDraws() {
    return api.get<StryktipsetDrawsResponse>("/stryktipset/draws");
  },

  getStryktipsetResults() {
    return api.get<StryktipsetResultsResponse>("/stryktipset/results");
  },
};