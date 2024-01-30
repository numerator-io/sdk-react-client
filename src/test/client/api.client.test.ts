import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { ApiRequestOptions, ConfigClient } from '../../main/client/type.client';
import ApiClient from '../../main/client/api.client';

// Mocking axios
jest.mock('axios');

describe('ApiClient', () => {
  const mockConfig: ConfigClient = {
    apiKey: 'test-api-key',
    baseUrl: 'https://example.com/api',
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should make a successful request', async () => {
    const apiRequestOptions: ApiRequestOptions = {
      endpoint: 'test-endpoint',
    };

    const mockResponseData = { key: 'value' };
    const mockAxiosResponse: AxiosResponse<typeof mockResponseData> = {
      data: mockResponseData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {} as AxiosRequestHeaders,
      },
    };

    // Mocking axios.request to resolve with the mock response
    (axios.request as jest.Mock).mockResolvedValueOnce(mockAxiosResponse);

    // Arrange
    const apiClient = new ApiClient(mockConfig);

    // Act
    const result = await apiClient.request<typeof mockResponseData>(apiRequestOptions);

    // Assert
    expect(result).toEqual({ data: mockResponseData, error: undefined });
  });

  it('should handle request error', async () => {
    const apiRequestOptions: ApiRequestOptions = {
      endpoint: 'test-endpoint',
    };

    const mockAxiosError = {
      message: 'Request failed with status code 404',
      response: {
        status: 404,
        data: { message: 'Not Found', error_code: 'not_found' },
      },
    };

    // Mocking axios.request to reject with the mock error
    (axios.request as jest.Mock).mockRejectedValueOnce(mockAxiosError);

    // Arrange
    const apiClient = new ApiClient(mockConfig);

    // Act
    const result = await apiClient.request<any>(apiRequestOptions);

    // Assert
    expect(result).toEqual({
      data: undefined,
      error: {
        message: 'Not Found',
        errorCode: 'not_found',
        errorStatus: 404,
      },
    });
  });
});
