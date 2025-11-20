import axios from "axios";
import {
  AuthResponse,
  Billing,BillingResponse,RefreshResponse
} from "../types/billing.types";
import apiClient from "./config/api-config.api";

const getBillings = async (user_id:number) : Promise<Billing[]> => {
  try {
    const response = await apiClient.get(`/billings/${user_id}`)
    return response.data
  } catch (error) {
    console.log(error);
  }
};

const getSummaryBillings = async (user_id:number) : Promise<Billing[]> => {
  try {
    const response = await apiClient.get(`/billings/summary/${user_id}`)
    return response.data
  } catch (error) {
    console.log(error);
  }
};

export const billingService = {
    getBillings,getSummaryBillings
};
