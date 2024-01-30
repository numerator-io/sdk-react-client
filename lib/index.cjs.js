'use strict';

var axios = require('axios');
var jsxRuntime = require('react/jsx-runtime');
var react = require('react');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

class ApiClient {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || 'https://service-platform.dev.numerator.io'; //'https://api.numerator.io/v1';
    }
    request(apiRequestOptions) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.baseUrl}/${apiRequestOptions.endpoint}`;
            const headers = {
                'Content-Type': 'application/json',
                [ApiClient.API_KEY_HEADER]: this.apiKey,
            };
            const config = Object.assign({ url,
                headers }, apiRequestOptions);
            try {
                const response = yield axios.request(config);
                return { data: response.data, error: undefined };
            }
            catch (error) {
                const axiosResponse = error.response;
                if (axiosResponse) {
                    const errorResponse = {
                        message: ((_a = axiosResponse.data) === null || _a === void 0 ? void 0 : _a.message) || 'Unknown Error',
                        errorCode: ((_b = axiosResponse.data) === null || _b === void 0 ? void 0 : _b.error_code) || 'unknown_error',
                        errorStatus: axiosResponse.status,
                    };
                    return { data: undefined, error: errorResponse };
                }
                else {
                    console.warn('AxiosError:', error.message);
                    return {
                        data: undefined,
                        error: { message: 'Unknown Error', error_code: 'unknown_error', http_status: 500 },
                    };
                }
            }
        });
    }
}
ApiClient.API_KEY_HEADER = 'X-NUM-API-KEY';

const END_POINT_BASE = 'api/sdk/feature-flag';
// Get all feature flags config associated with the project
const END_POINT_FEATURE_FLAG_CONFIG_LISTING = `${END_POINT_BASE}/listing`;
// Get the config of a feature flag by key
const END_POINT_FEATURE_FLAG_CONFIG_BY_KEY = `${END_POINT_BASE}/detail-by-key`;
// Get the value of the feature flag by key
const END_POINT_FEATURE_FLAG_VALUE_BY_KEY = `${END_POINT_BASE}/by-key`;

class NumeratorClient {
    constructor(config) {
        this.handleFeatureFlagNotFound = () => {
            return Promise.reject({
                message: 'Feature Flag not found',
                errorCode: 'FEATURE_FLAG_NOT_FOUND',
                errorStatus: 404,
            });
        };
        this.apiClient = new ApiClient(config);
    }
    featureFlagConfigListing(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.apiClient.request({
                    method: 'POST',
                    endpoint: END_POINT_FEATURE_FLAG_CONFIG_LISTING,
                    data: request || {},
                });
                if (response.error) {
                    console.warn('Error fetching featureFlagConfigListing due to: [', response.error, ']');
                    return Promise.reject(response.error);
                }
                return response.data || { count: 0, data: [] };
            }
            catch (error) {
                console.warn('Error fetching featureFlagConfigListing due to: [', error, ']');
                return Promise.reject(error);
            }
        });
    }
    allFeatureFlagsConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let page = 0;
                const size = 200;
                let allConfigs = [];
                let configListingRes;
                do {
                    configListingRes = yield this.featureFlagConfigListing({
                        page: page++,
                        size: size,
                    });
                    allConfigs = allConfigs.concat(configListingRes.data);
                } while (allConfigs.length < configListingRes.count);
                return allConfigs;
            }
            catch (error) {
                console.error('Error fetching allFeatureFlagsConfig due to:', error);
                throw error;
            }
        });
    }
    featureFlagConfigByKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.apiClient.request({
                    method: 'GET',
                    endpoint: END_POINT_FEATURE_FLAG_CONFIG_BY_KEY,
                    params: { key },
                });
                if (response.error) {
                    console.warn('Error fetching featureFlagConfigByKey due to: [', response.error, ']');
                    return Promise.reject(response.error);
                }
                if (!response.data) {
                    return this.handleFeatureFlagNotFound();
                }
                return response.data;
            }
            catch (error) {
                console.warn('Error fetching featureFlagConfigByKey due to: [', error, ']');
                return Promise.reject(error);
            }
        });
    }
    featureFlagValueByKey(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.apiClient.request({
                    method: 'POST',
                    endpoint: END_POINT_FEATURE_FLAG_VALUE_BY_KEY,
                    data: request,
                });
                if (response.error) {
                    console.warn('Error fetching featureFlagValueByKey due to: [', response.error, ']');
                    return Promise.reject(response.error);
                }
                if (!response.data) {
                    return this.handleFeatureFlagNotFound();
                }
                return response.data;
            }
            catch (error) {
                console.warn('Error fetching featureFlagValueByKey due to: [', error, ']');
                return Promise.reject(error);
            }
        });
    }
}

// Create a context for the SDK
const NumeratorContext = react.createContext(undefined);

// Deep copy an object using JSON
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
// Async sleep function using Promises
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
// Map an array of objects to a Record using a specific key
const mapArrayToRecord = (array) => {
    return Object.fromEntries(array.map((item) => [item.key, item]));
};
// Function to create a promise with a timeout
const withTimeout = (promise, timeout) => {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), timeout));
    return Promise.race([promise, timeoutPromise]);
};

const initializeNumeratorClient = (configClient) => {
    const numeratorClient = new NumeratorClient({
        apiKey: configClient.apiKey,
        baseUrl: configClient.baseUrl || 'https://service-platform.dev.numerator.io',
    });
    return numeratorClient;
};
// Create a provider component
const NumeratorProvider = ({ children, loadAllFlagsConfigOnMount, configClient, }) => {
    // Initialize the SDK client
    const numeratorClient = initializeNumeratorClient(configClient);
    const [featureFlagsConfig, setFeatureFlagsConfig] = react.useState({});
    const [featureFlagsValue, setFeatureFlagsState] = react.useState({});
    const fetchAllFeatureFlagsConfig = () => __awaiter(void 0, void 0, void 0, function* () {
        const allFlagsConfig = yield numeratorClient.allFeatureFlagsConfig();
        setFeatureFlagsConfig(mapArrayToRecord(allFlagsConfig));
    });
    const fetchFeatureFlagConfig = ({ key }) => __awaiter(void 0, void 0, void 0, function* () {
        const featureFlagConfig = yield numeratorClient.featureFlagConfigByKey(key);
        // Update the state directly with the new Record containing a single FeatureFlag
        setFeatureFlagsConfig(Object.assign(Object.assign({}, featureFlagsConfig), { [featureFlagConfig.key]: featureFlagConfig }));
    });
    const fetchFeatureFlagValue = ({ key, context }) => __awaiter(void 0, void 0, void 0, function* () {
        const featureFlagValue = yield numeratorClient.featureFlagValueByKey({ key: key, context });
        // Update the state directly with the new Record containing a single FeatureFlagState
        setFeatureFlagsState(Object.assign(Object.assign({}, featureFlagsValue), { [featureFlagValue.key]: featureFlagValue }));
    });
    react.useEffect(() => {
        if (loadAllFlagsConfigOnMount) {
            fetchAllFeatureFlagsConfig();
        }
    }, []);
    // Create an object with SDK methods and state to be shared
    const sdkContextValue = {
        featureFlagsConfig,
        featureFlagsValue,
        fetchAllFeatureFlagsConfig,
        fetchFeatureFlagConfig,
        fetchFeatureFlagValue,
    };
    return jsxRuntime.jsx(NumeratorContext.Provider, { value: sdkContextValue, children: children });
};
// Custom hook to access the SDK context value
const useNumeratorContext = () => {
    const context = react.useContext(NumeratorContext);
    if (!context) {
        throw new Error('NumeratorClient must be used within a NumeratorProvider');
    }
    return context;
};

// --- Types for Feature Flag --- //
exports.FlagStatusEnum = void 0;
(function (FlagStatusEnum) {
    FlagStatusEnum[FlagStatusEnum["ON"] = 0] = "ON";
    FlagStatusEnum[FlagStatusEnum["OFF"] = 1] = "OFF";
})(exports.FlagStatusEnum || (exports.FlagStatusEnum = {}));
exports.FlagValueTypeEnum = void 0;
(function (FlagValueTypeEnum) {
    FlagValueTypeEnum[FlagValueTypeEnum["BOOLEAN"] = 0] = "BOOLEAN";
    FlagValueTypeEnum[FlagValueTypeEnum["STRING"] = 1] = "STRING";
})(exports.FlagValueTypeEnum || (exports.FlagValueTypeEnum = {}));

exports.NumeratorClient = NumeratorClient;
exports.NumeratorProvider = NumeratorProvider;
exports.deepCopy = deepCopy;
exports.mapArrayToRecord = mapArrayToRecord;
exports.sleep = sleep;
exports.useNumeratorContext = useNumeratorContext;
exports.withTimeout = withTimeout;
//# sourceMappingURL=index.cjs.js.map
