import { Billing } from "../types/billing.types";
import apiClient from "./config/api-config.api";

const getBillings = async (user_id: number): Promise<Billing[]> => {
  try {
    const response = await apiClient.get(`/billings/${user_id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getSummaryBillings = async (user_id: number): Promise<Billing[]> => {
  try {
    const response = await apiClient.post(`/pays/summary/${user_id}`, {
      user_id: user_id,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getAllSummaryBillings = async (filters?:{month?:number,year?:number,find?:string}): Promise<Billing[]> => {
  try {
    const response = await apiClient.post(`pays/summary/all`,filters);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Llamado a funcion de cambio de status
const updateStatus = async (id: number) => {
  try {
    const response = await apiClient.patch(`pays/changeStatus/${id}`);
    return response.data;
  } catch (error) {
    console.log("Ocurrio un error al actualizar el estado de pago");
  }
};

export const billingService = {
  getBillings,
  getSummaryBillings,
  getAllSummaryBillings,
  updateStatus,
};
