import { ApiClient } from '@/client/api.client';
import {
  END_POINT_FEATURE_FLAG_COLLECTION_POLLING,
  END_POINT_FEATURE_FLAG_CONFIG_BY_KEY,
  END_POINT_FEATURE_FLAG_CONFIG_LISTING,
  END_POINT_FEATURE_FLAG_VALUE_BY_KEY,
} from '@/client/endpoint.client';
import {
  ConfigClient,
  ErrorResponse,
  FeatureFlagConfig,
  FeatureFlagConfigListingRequest,
  FeatureFlagConfigListingResponse,
  FeatureFlagPollingResponse,
  FeatureFlagValueByKeyRequest,
  FlagCollection,
  FlagVariationValue,
} from '@/client/type.client';
import { getHeaderValue } from '@/util';

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
      const url = `${END_POINT_FEATURE_FLAG_CONFIG_BY_KEY}?key=${key}`;
      const response = await this.apiClient.request<FeatureFlagConfig>({
        method: 'GET',
        endpoint: url,
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

      return response.data;
    } catch (error: any) {
      console.warn('Error fetching featureFlagValueByKey due to: [', error, ']');
      return Promise.reject(error);
    }
  }

  async fetchPollingFlag(context: Record<string, any>, properties: Record<string, any> | undefined, eTag?: string | undefined): Promise<FeatureFlagPollingResponse> {
    try {
      const headers = !!eTag ? { 'If-None-Match': eTag } : {};
      const response = await this.apiClient.request<{ flags: FlagCollection[] }>({
        method: 'POST',
        headers: headers,
        endpoint: END_POINT_FEATURE_FLAG_COLLECTION_POLLING,
        data: { context, properties },
      });

      if (response.error) {
        console.warn('Error fetching featureFlagCollectionPolling due to: [', response.error, ']');
        return Promise.reject(response.error as ErrorResponse);
      }

      // Use the utility function to get the ETag header value safely
      const etag = getHeaderValue(response.headers, 'ETag');
      
      return { flags: response.data?.flags, etag: etag };
    } catch (error: any) {
      console.warn('Error fetching featureFlagCollectionPolling due to: [', error, ']');
      return Promise.reject(error);
    }
  }
}

export default NumeratorClient;
