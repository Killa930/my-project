/*
 * api/axios.js — настройка HTTP-клиента
 *
 * Все запросы к Laravel API проходят через этот файл.
 * Здесь настраивается:
 * - базовый URL (чтобы не писать каждый раз полный адрес)
 * - автоматическая подстановка токена авторизации
 * - обработка ошибки 401 (токен истёк → выкидываем на страницу входа)
 */

import axios from "axios";

const api = axios.create({
    // baseURL — все запросы будут начинаться с этого адреса
    // api.get('/cars') → GET http://localhost:8000/api/cars
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

/*
 * Interceptor (перехватчик) запросов.
 * Перед КАЖДЫМ запросом проверяет: есть ли токен в localStorage?
 * Если да — добавляет заголовок Authorization: Bearer {token}
 * Laravel Sanctum проверяет этот заголовок и определяет пользователя.
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/*
 * Interceptor ответов.
 * Если сервер вернул 401 (Unauthorized) — значит токен невалидный.
 * Удаляем токен и перенаправляем на страницу входа.
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            // Перенаправляем только если мы НЕ на странице входа
            if (
                window.location.pathname !== "/login" &&
                window.location.pathname !== "/register"
            ) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
