import { Config } from './types';
import axios, { AxiosRequestConfig } from 'axios';

export abstract class Client {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: Config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api-sdk.numerator.com';
  }

  protected request<T>(endpoint: string, options?: AxiosRequestConfig): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-NUM-API-KEY': this.apiKey,
    };
    const config: AxiosRequestConfig = {
      url,
      ...options,
      headers,
    };

    return axios.request<T>(config).then((response: any) => response.data);
  }

  allFeatureFlags(): Promise<any> {
    return this.request('/api/feature-flags');
  }

  getFeatureFlag(key: string): Promise<any> {
    return this.request(`/api/feature-flags/${key}`);
  }

  greet(name?: string): string {
    return 'Hello, World! ' + (name || '');
  }
}

export default Client;
