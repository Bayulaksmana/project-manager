import axios, { type AxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 80000,
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === "ECONNABORTED") {
            console.error("⏳ Request timeout:", error.message);
            error.message = "Permintaan ke server melebihi batas waktu (timeout).";
        }
        if (error.response?.status === 401) {
            window.dispatchEvent(new Event("force-logout"));
        }
        return Promise.reject(error);
    }
);

const request = async <T>(
    method: "get" | "post" | "put" | "delete" | "patch",
    url: string,
    data?: unknown,
    isJson: boolean = true,
    config: AxiosRequestConfig = {}
): Promise<T> => {
    try {
        const headers: Record<string, string> = {};
        if (isJson) {
            headers["Content-Type"] = "application/json";
        }
        const response = await api.request<T>({
            method,
            url,
            data,
            headers,
            ...config,
        });
        return response.data;
    } catch (error: any) {
        console.error(`API ${method.toUpperCase()} ${url} failed:`, error.message);
        throw error;
    }
};

export const postData = <T>(url: string, data: unknown, isJson = true) =>
    request<T>("post", url, data, isJson);

export const postDataAI = <T>(url: string, data?: any) => {
    request<T>("post", url, data);
}

export const updateData = <T>(url: string, data: unknown, isJson = true) =>
    request<T>("put", url, data, isJson);

export const fetchData = <T>(url: string) => request<T>("get", url);

export const deleteData = <T>(url: string) => request<T>("delete", url);

export const patchData = <T>(url: string) => request<T>("patch", url);