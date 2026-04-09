import API from "./axios";

export const createOrderApi = (amount: number) =>
  API.post("/billing/create-order", { amount });