import { AxiosRequestConfig } from 'axios';

// --- Types for ConfigClient --- //
export type ConfigClient = {
  apiKey: string;
  baseUrl?: string;
};

// --- Types for ApiClient --- //
export interface ErrorResponse {
  message: string;
  errorCode: string;
  errorStatus: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ErrorResponse | any;
}

export interface ApiRequestOptions extends AxiosRequestConfig {
  endpoint: string;
}

export interface ApiClientInterface {
  apiKey: string;
  baseUrl: string;

  request<T>(apiRequestOptions: ApiRequestOptions): Promise<ApiResponse<T>>;
}

// --- Types for Request/ Response --- //
export interface PaginationRequest {
  page?: number;
  size?: number;
}

export interface PaginationResponse<T> {
  count: number;
  data: T[];
}

export interface FeatureFlagConfigListingRequest extends PaginationRequest {
  page?: number;
  size?: number;
}

export interface FeatureFlagValueByKeyRequest {
  key: string;
  context?: Record<string, any>;
}

export interface FeatureFlagConfigListingResponse extends PaginationResponse<FeatureFlagConfig> {
  count: number;
  data: FeatureFlagConfig[];
}

// --- Types for Feature Flag --- //
export enum FlagStatusEnum {
  ON = 'ON',
  OFF = 'OFF',
}

export enum FlagValueTypeEnum {
  BOOLEAN = 'BOOLEAN',
  STRING = 'STRING',
}

export interface FeatureFlagConfig {
  id: string;
  name: string;
  key: string;
  organizationId: string;
  projectId: string;
  status: FlagStatusEnum;
  description?: string | null;
  defaultOnVariationId: string;
  defaultOffVariationId: string;
  valueType: FlagValueTypeEnum;
  createdAt: Date;
}

export interface FeatureFlagValue<T> {
  key: string;
  status: FlagStatusEnum;
  value: T;
  valueType: FlagValueTypeEnum;
}
