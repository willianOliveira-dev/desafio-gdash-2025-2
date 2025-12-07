import { settings } from '@/config/settings';
import { refreshService } from './auth.service';
import type { ApiResponse } from '@/interfaces/http/response/api-response.interface';
import type { ApiError } from '@/interfaces/http/response/api-error.interface';

const API_URL = settings.VITE_API_URL;

export async function api<T = null>(
    baseUrl: string,
    options?: RequestInit,
    retry = true
): Promise<ApiResponse<T>> {
    const isFormData = options?.body instanceof FormData;

    const res = await fetch(`${API_URL}/${baseUrl}`, {
        credentials: 'include',
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        },
        ...options,
    });

    if (res.ok) {
        return res.json() as unknown as ApiResponse<T>;
    }

    if (res.status === 401 && retry &&  baseUrl !== "auth/refresh") {
        try {
            const data = await refreshService();
            console.log(data);
            return api<T>(baseUrl, options, false);
        } catch {
            throw { message: 'Sessão expirada.', status: 401 };
        }
    }

    const error = (await res.json()) as ApiError;

    throw error;
}
