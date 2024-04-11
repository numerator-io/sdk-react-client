import { snakeToCamel } from '../util';
import { ApiRequestOptions, ApiResponse, ConfigClient } from './type.client';

export class ApiClient {
  readonly apiKey: string;
  readonly baseUrl: string;
  static readonly API_KEY_HEADER = 'X-NUM-API-KEY';

  constructor(config: ConfigClient) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://service-platform.dev.numerator.io'; //'https://api.numerator.io/v1';
  }

  async request<T>(apiRequestOptions: ApiRequestOptions): Promise<ApiResponse<T>> {
    const { method, endpoint, data } = apiRequestOptions
    const url = `${this.baseUrl}/${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      [ApiClient.API_KEY_HEADER]: this.apiKey,
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(data),
      });
      return { data: snakeToCamel(response.json()), error: undefined, headers: response.headers };
    } catch (error: Error | any) {
      return { data: undefined, error };
    }
  }
}

export default ApiClient;
