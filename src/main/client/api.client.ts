import axios, { AxiosRequestConfig } from 'axios';
import { ApiClientInterface, ApiRequestOptions, ApiResponse, ConfigClient, ErrorResponse } from './type.client';
import { snakeToCamel } from '../util';

export class ApiClient implements ApiClientInterface {
  readonly apiKey: string;
  readonly baseUrl: string;
  static readonly API_KEY_HEADER = 'X-NUM-API-KEY';

  constructor(config: ConfigClient) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://service-platform.dev.numerator.io'; //'https://api.numerator.io/v1';
  }

  async request<T>(apiRequestOptions: ApiRequestOptions): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/${apiRequestOptions.endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      [ApiClient.API_KEY_HEADER]: this.apiKey,
    };
    const config: AxiosRequestConfig = {
      url,
      headers,
      ...apiRequestOptions,
    };

    try {
      const response = await axios.request<T>(config);
      return { data: snakeToCamel(response.data), error: undefined, headers: response.headers };
    } catch (error: Error | any) {
      const axiosResponse = error.response;
      if (axiosResponse) {
        const errorResponse: ErrorResponse = {
          message: axiosResponse.data?.message || 'Unknown Error',
          errorCode: axiosResponse.data?.error_code || 'unknown_error',
          errorStatus: axiosResponse.status,
        };
        return { data: undefined, error: errorResponse };
      } else {
        console.warn('AxiosError:', error.message);
        return {
          data: undefined,
          error: { message: 'Unknown Error', error_code: 'unknown_error', http_status: 500 },
        };
      }
    }
  }
}

export default ApiClient;
