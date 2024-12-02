import { isAxiosError, type AxiosInstance } from 'axios';


import { LoginResponse } from '../types/services/credenciais';
import { ApiError, TError } from '../types';

export default class CredenciaisService {
    constructor(private _api: AxiosInstance) { }

    async login(email?: string, senha?: string): Promise<LoginResponse> {
        try {
            const payload = {
                email,
                senha,
            };

            console.log('antes', payload)
            const response = await this._api.post<LoginResponse>('/Credenciais/login', payload);
console.log('resp?', response)
            return response?.data;
        } catch (error) {
            console.log(error)
            if (isAxiosError<ApiError>(error) && error?.response) {
                throw error?.response?.data;
            } else {
                throw error as TError;
            }
        }
    }
}
