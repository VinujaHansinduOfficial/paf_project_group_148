import axios from "axios";

const BASE_URL = "http://localhost:8080/posts/"; // Change if needed

export const savePost = (user) => {
  return axios.post(`${BASE_URL}`, user);
};

export const getAllPost = () => {
  return axios.get(`${BASE_URL}getAll`);
};

export const deletePost = (postId) => {
  return axios.delete(`${BASE_URL}delete/${postId}`);
};

export const getPostById = (postId) => {
  return axios.get(`${BASE_URL}getById/${postId}`);
};

export const updatePost = (postId, post) => {
  return axios.put(`${BASE_URL}update/${postId}`, post);
};
