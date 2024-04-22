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
  headers?: any
}

export interface ApiRequestOptions {
  endpoint: string;
  method: string;
  headers?: Record<string, any>;
  data?: Record<string, any>;

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

export interface FeatureFlagPollingResponse {
  flags: FlagCollection[],
  etag: string
}
// --- Types for Feature Flag --- //
export type VariationKeyType = 'stringValue' | 'booleanValue' | 'longValue' | 'doubleValue';

export enum FlagStatusEnum {
  ON = 'ON',
  OFF = 'OFF',
}

export enum FlagValueTypeEnum {
  BOOLEAN = 'BOOLEAN',
  STRING = 'STRING',
  LONG = 'LONG',
  DOUBLE = 'DOUBLE',
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

export interface FlagVariationValue {
  key: string;
  status: FlagStatusEnum;
  value: VariationValue;
  valueType: FlagValueTypeEnum;
}

export interface VariationValue {
  stringValue?: string;
  booleanValue?: boolean;
  longValue?: number;
  doubleValue?: number;
}

export interface FlagEvaluationDetail<T> {
  key: string,
  value: T,
  reason: Record<string, any> | null
}

export interface FlagCollection {
  id: string,
  key: string,
  value: VariationValue,
  valueType: FlagValueTypeEnum,
  createdAt: string
}
