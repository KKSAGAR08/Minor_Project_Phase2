import React from "react";
import axios from "axios";

export const AuthAPI = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
});

export const DataAPI = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
});

DataAPI.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);
