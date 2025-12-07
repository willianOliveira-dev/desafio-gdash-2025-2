import { api } from './api';
import type { User } from '@/interfaces/http/models/user.interface';
import type { Login } from '@/interfaces/http/models/login.interface';
import type { ApiResponse } from '@/interfaces/http/response/api-response.interface';

export function loginService(data: Login): Promise<ApiResponse<null>> {
    return api('auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function logoutService(): Promise<ApiResponse<null>> {
    return api('auth/logout', {
        method: 'POST',
    });
}

export function refreshService(): Promise<ApiResponse<null>> {
    return api('auth/refresh', {
        method: 'POST',
    }, false);
}

export function meService(): Promise<ApiResponse<User>> {
    return api<User>('auth/me');
}
