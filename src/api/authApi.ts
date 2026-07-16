import { api } from "./axios";

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
}

export async function login(
    username: string,
    password: string
): Promise<LoginResponse> {

    const response = await api.post<LoginResponse>(
        "/auth/sign_in",
        {
            username,
            password,
        }
    );

    return response.data;
}
