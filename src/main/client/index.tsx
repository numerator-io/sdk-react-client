import { ApiClient } from './api.client';
import {
  END_POINT_FEATURE_FLAG_CONFIG_BY_KEY,
  END_POINT_FEATURE_FLAG_CONFIG_LISTING,
  END_POINT_FEATURE_FLAG_VALUE_BY_KEY,
} from './endpoint.client';
import {
  ConfigClient,
  ErrorResponse,
  FeatureFlagConfig,
  FeatureFlagConfigListingRequest,
  FeatureFlagConfigListingResponse,
  FeatureFlagValueByKeyRequest,
  FlagVariationValue
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

  async featureFlagConfigListing(request?: FeatureFlagConfigListingRequest): Promise<FeatureFlagConfigListingResponse> {
    try {
      const response = await this.apiClient.request<FeatureFlagConfigListingResponse>({
        method: 'POST',
        endpoint: END_POINT_FEATURE_FLAG_CONFIG_LISTING,
        data: request || {},
      });

      if (response.error) {
        console.warn('Error fetching featureFlagConfigListing due to: [', response.error, ']');
        return Promise.reject(response.error as ErrorResponse);
      }

      return response.data || { count: 0, data: [] };
    } catch (error: any) {
      console.warn('Error fetching featureFlagConfigListing due to: [', error, ']');
      return Promise.reject(error);
    }
  }

  async allFeatureFlagsConfig(): Promise<FeatureFlagConfig[]> {
    try {
      let page = 0;
      const size = 200;
      let allConfigs: FeatureFlagConfig[] = [];
      let configListingRes: FeatureFlagConfigListingResponse;

      do {
        configListingRes = await this.featureFlagConfigListing({
          page: page++,
          size: size,
        });

        allConfigs = allConfigs.concat(configListingRes.data);
      } while (allConfigs.length < configListingRes.count);

      return allConfigs;
    } catch (error) {
      console.error('Error fetching allFeatureFlagsConfig due to:', error);
      throw error;
    }
  }

  async featureFlagConfigByKey(key: string): Promise<FeatureFlagConfig> {
    try {
      const response = await this.apiClient.request<FeatureFlagConfig>({
        method: 'GET',
        endpoint: END_POINT_FEATURE_FLAG_CONFIG_BY_KEY,
        params: { key },
      });

      if (response.error) {
        console.warn('Error fetching featureFlagConfigByKey due to: [', response.error, ']');
        return Promise.reject(response.error as ErrorResponse);
      }

      if (!response.data) {
        return this.handleFeatureFlagNotFound();
      }

      return response.data;
    } catch (error: any) {
      console.warn('Error fetching featureFlagConfigByKey due to: [', error, ']');
      return Promise.reject(error);
    }
  }

  async getFeatureFlagByKey<T>(request: FeatureFlagValueByKeyRequest): Promise<FlagVariationValue> {
    try {
      const response = await this.apiClient.request<FlagVariationValue>({
        method: 'POST',
        endpoint: END_POINT_FEATURE_FLAG_VALUE_BY_KEY,
        data: request,
      });
      if (response.error) {
        console.warn('Error fetching featureFlagValueByKey due to: [', response.error, ']');
        return Promise.reject(response.error as ErrorResponse);
      }

      if (!response.data) {
        return this.handleFeatureFlagNotFound();
      }

     return response.data
    } catch (error: any) {
      console.warn('Error fetching featureFlagValueByKey due to: [', error, ']');
      return Promise.reject(error);
    }
  }
}

export default NumeratorClient;
