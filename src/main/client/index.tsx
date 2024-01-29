import { ApiClient } from './api.client';
import {
  END_POINT_FEATURE_FLAGS,
  END_POINT_FEATURE_FLAG_DETAIL_BY_ID,
  END_POINT_FEATURE_FLAG_DETAIL_BY_KEY,
  END_POINT_FEATURE_FLAG_STATE_BY_ID,
  END_POINT_FEATURE_FLAG_STATE_BY_KEY,
} from './endpoint.client';
import {
  ConfigClient,
  ErrorResponse,
  FeatureFlag,
  FeatureFlagState,
  FeatureFlagStateByIdRequest,
  FeatureFlagStateByKeyRequest,
  FeatureFlagsRequest,
  FeatureFlagsResponse,
} from './type.client';

export class NumeratorClient {
  private apiClient: ApiClient;

  constructor(config: ConfigClient) {
    this.apiClient = new ApiClient(config);
  }

  handleFeatureFlagNotFound = (): Promise<never> => {
    return Promise.reject({
      message: 'Feature Flag not found',
      errorCode: 'FEATURE_FLAG_NOT_FOUND',
      errorStatus: 404,
    } as ErrorResponse);
  };

  async featureFlags(request?: FeatureFlagsRequest): Promise<FeatureFlagsResponse> {
    try {
      const response = await this.apiClient.request<FeatureFlagsResponse>({
        method: 'POST',
        endpoint: END_POINT_FEATURE_FLAGS,
        data: request || {},
      });

      if (response.error) {
        console.warn('Error fetching featureFlags due to: [', response.error, ']');
        return Promise.reject(response.error as ErrorResponse);
      }

      return response.data || { count: 0, data: [] };
    } catch (error: any) {
      console.warn('Error fetching featureFlags due to: [', error, ']');
      return Promise.reject(error);
    }
  }

  async featureFlagByKey(key: string): Promise<FeatureFlag> {
    try {
      const response = await this.apiClient.request<FeatureFlag>({
        method: 'GET',
        endpoint: END_POINT_FEATURE_FLAG_DETAIL_BY_KEY,
        params: { key },
      });

      if (response.error) {
        console.warn('Error fetching featureFlagByKey due to: [', response.error, ']');
        return Promise.reject(response.error as ErrorResponse);
      }

      if (!response.data) {
        return this.handleFeatureFlagNotFound();
      }

      return response.data;
    } catch (error: any) {
      console.warn('Error fetching featureFlagByKey due to: [', error, ']');
      return Promise.reject(error);
    }
  }

  async featureFlagById(id: string): Promise<FeatureFlag> {
    try {
      const response = await this.apiClient.request<FeatureFlag>({
        method: 'GET',
        endpoint: END_POINT_FEATURE_FLAG_DETAIL_BY_ID,
        params: { id },
      });

      if (response.error) {
        console.warn('Error fetching featureFlagById due to: [', response.error, ']');
        return Promise.reject(response.error as ErrorResponse);
      }

      if (!response.data) {
        return this.handleFeatureFlagNotFound();
      }

      return response.data;
    } catch (error: any) {
      console.warn('Error fetching featureFlagById due to: [', error, ']');
      return Promise.reject(error);
    }
  }

  async featureFlagStateByKey<T>(request: FeatureFlagStateByKeyRequest): Promise<FeatureFlagState<T>> {
    try {
      const response = await this.apiClient.request<FeatureFlagState<T>>({
        method: 'POST',
        endpoint: END_POINT_FEATURE_FLAG_STATE_BY_KEY,
        data: request,
      });

      if (response.error) {
        console.warn('Error fetching featureFlagStateByKey due to: [', response.error, ']');
        return Promise.reject(response.error as ErrorResponse);
      }

      if (!response.data) {
        return this.handleFeatureFlagNotFound();
      }

      return response.data;
    } catch (error: any) {
      console.warn('Error fetching featureFlagStateByKey due to: [', error, ']');
      return Promise.reject(error);
    }
  }

  async featureFlagStateById<T>(request: FeatureFlagStateByIdRequest): Promise<FeatureFlagState<T>> {
    try {
      const response = await this.apiClient.request<FeatureFlagState<T>>({
        method: 'POST',
        endpoint: END_POINT_FEATURE_FLAG_STATE_BY_ID,
        data: request,
      });

      if (response.error) {
        console.warn('Error fetching featureFlagStateById due to: [', response.error, ']');
        return Promise.reject(response.error as ErrorResponse);
      }

      if (!response.data) {
        return this.handleFeatureFlagNotFound();
      }

      return response.data;
    } catch (error: any) {
      console.warn('Error fetching featureFlagStateById due to: [', error, ']');
      return Promise.reject(error);
    }
  }
}

export default NumeratorClient;
