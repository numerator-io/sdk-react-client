import ApiClient from "../../main/client/api.client";
import { ApiRequestOptions, ApiResponse } from "../../main/client/type.client";


// Mocking fetch function
const mockFetch = jest.fn();

beforeAll(() => {
  // @ts-ignore
  global.fetch = mockFetch;
});

afterEach(() => {
  mockFetch.mockClear();
});

afterAll(() => {
  // @ts-ignore
  global.fetch.mockRestore();
});

describe('ApiClient', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient({
      apiKey: 'testApiKey',
      baseUrl: 'https://test-api.com',
    });
  });

  it('should make a successful API request', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({}),
      headers: new Headers(),
      ok: true
    });

    const apiRequestOptions: ApiRequestOptions = {
      method: 'GET',
      endpoint: 'test',
      data: {},
    };

    const response: ApiResponse<any> = await apiClient.request(apiRequestOptions);

    expect(mockFetch).toHaveBeenCalledWith('https://test-api.com/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-NUM-API-KEY': 'testApiKey',
      },
      body: '{}',
    });

    expect(response.error).toBeUndefined();
    expect(response.data).toEqual({});
  });

  it('should handle API request error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API request failed'));

    const apiRequestOptions: ApiRequestOptions = {
      method: 'GET',
      endpoint: 'test',
      data: {},
    };

    const response: ApiResponse<any> = await apiClient.request(apiRequestOptions);

    expect(mockFetch).toHaveBeenCalledWith('https://test-api.com/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-NUM-API-KEY': 'testApiKey',
      },
      body: '{}',
    });

    expect(response.data).toBeUndefined();
    expect(response.error.message).toEqual('API request failed');
  });
});
