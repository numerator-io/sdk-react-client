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

export interface FeatureFlagsRequest extends PaginationRequest {
  page?: number;
  size?: number;
}

export interface FeatureFlagStateByIdRequest {
  id: string;
  context?: Record<string, any>;
}

export interface FeatureFlagStateByKeyRequest {
  key: string;
  context?: Record<string, any>;
}

export interface FeatureFlagsResponse extends PaginationResponse<FeatureFlag> {
  count: number;
  data: FeatureFlag[];
}

// --- Types for Feature Flag --- //
export enum FlagStatusEnum {
  ON,
  OFF,
}

export enum FlagValueTypeEnum {
  BOOLEAN,
  STRING,
}

export interface FeatureFlag {
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

export interface FeatureFlagState<T> {
  key: string;
  status: FlagStatusEnum;
  value: T;
  valueType: FlagValueTypeEnum;
}
