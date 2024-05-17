import { snakeToCamel } from '@/util';
import { ApiRequestOptions, ApiResponse, ConfigClient } from '@/client/type.client';

export class ApiClient {
  readonly apiKey: string;
  readonly baseUrl: string;
  static readonly API_KEY_HEADER = 'X-NUM-API-KEY';

  constructor(config: ConfigClient) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://service-platform.numerator.io'; //'https://api.numerator.io/v1';
  }

  async request<T>(apiRequestOptions: ApiRequestOptions): Promise<ApiResponse<T>> {
    const { method, endpoint, data, headers: headerRequest } = apiRequestOptions;
    const url = `${this.baseUrl}/${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      [ApiClient.API_KEY_HEADER]: this.apiKey,
      ...headerRequest,
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(data),
      });

      // Handle 304 Not Modified response
      if (response.status === 304) {
        return {};
      }

      // Check if the request was successful
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      return { data: snakeToCamel(jsonData), error: undefined, headers: response.headers };
    } catch (error: Error | any) {
      return { data: undefined, error };
    }
  }
}

export default ApiClient;
