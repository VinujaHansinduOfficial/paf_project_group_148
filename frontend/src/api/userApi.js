import axios from "axios";

const BASE_URL = "http://localhost:8080/users"; // Change if needed

export const registerUser = (user) => {
  return axios.post(`${BASE_URL}/register`, user);
};

export const loginUser = (user) => {
  return axios.post(`${BASE_URL}/login`, user);
};

export const updateOnlineStatus = (userId, isOnline) => {
  return axios.put(`${BASE_URL}/${userId}/status?online=${isOnline}`);
};
