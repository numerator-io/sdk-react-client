import axios from 'axios';
import { jsx } from 'react/jsx-runtime';
import { createContext, useState, useContext } from 'react';

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

/**
 * Deep copy an object using JSON.
 * @param obj - The object to be deep copied.
 * @returns A deep copy of the input object.
 */
/**
 * Convert snakecase object to camelcase object.
 * @param obj - The original object.
 * @returns A Promise that return camel object.
 */
const snakeToCamel = (obj) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(snakeToCamel);
    }
    return Object.keys(obj).reduce((acc, key) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        acc[camelKey] = snakeToCamel(obj[key]);
        return acc;
    }, {});
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
                return { data: snakeToCamel(response.data), error: undefined };
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
    getFeatureFlagByKey(request) {
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
const NumeratorContext = createContext(undefined);

const initializeNumeratorClient = (configClient) => {
    const numeratorClient = new NumeratorClient({
        apiKey: configClient.apiKey,
        baseUrl: configClient.baseUrl || 'https://service-platform.dev.numerator.io',
    });
    return numeratorClient;
};
// Create a provider component
const NumeratorProvider = ({ children, configClient, defaultContext }) => {
    // Initialize the SDK client
    const numeratorClient = initializeNumeratorClient(configClient);
    const [featureFlags, setFeatureFlags] = useState({});
    const flagValueByKey = (key, context) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield numeratorClient.getFeatureFlagByKey({ key, context });
        return result;
    });
    const allFlags = () => __awaiter(void 0, void 0, void 0, function* () {
        const allFlagsConfig = yield numeratorClient.allFeatureFlagsConfig();
        return allFlagsConfig;
    });
    const booleanFlagVariation = (key, defaultVal, context = undefined, useDefaultContext = true) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const requestContext = context !== null && context !== void 0 ? context : (useDefaultContext ? defaultContext : {});
            const variation = yield flagValueByKey(key, requestContext);
            return {
                key: key,
                value: (_a = variation.value.booleanValue) !== null && _a !== void 0 ? _a : false,
                reason: {},
            };
        }
        catch (e) {
            return {
                key: key,
                value: defaultVal,
                reason: {},
            };
        }
    });
    const numberFlagVariation = (key, defaultVal, context = undefined, useDefaultContext = true) => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c;
        try {
            const requestContext = context !== null && context !== void 0 ? context : (useDefaultContext ? defaultContext : {});
            const variation = yield flagValueByKey(key, requestContext);
            return {
                key: key,
                value: (_c = (_b = variation.value.longValue) !== null && _b !== void 0 ? _b : variation.value.doubleValue) !== null && _c !== void 0 ? _c : 0,
                reason: {},
            };
        }
        catch (e) {
            return {
                key: key,
                value: defaultVal,
                reason: {},
            };
        }
    });
    const stringFlagVariation = (key, defaultVal, context = undefined, useDefaultContext = true) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        try {
            const requestContext = context !== null && context !== void 0 ? context : (useDefaultContext ? defaultContext : {});
            const variation = yield flagValueByKey(key, requestContext);
            return {
                key: key,
                value: (_d = variation.value.stringValue) !== null && _d !== void 0 ? _d : '',
                reason: {},
            };
        }
        catch (e) {
            return {
                key: key,
                value: defaultVal,
                reason: {},
            };
        }
    });
    const initFeatureFlag = (key, defaultVal) => {
        featureFlags[key] = defaultVal;
        setFeatureFlags(featureFlags);
    };
    const getFeatureFlag = (key, context = undefined, useDefaultContext = true) => __awaiter(void 0, void 0, void 0, function* () {
        const defaultVal = featureFlags[key];
        switch (typeof defaultVal) {
            case 'boolean':
                const resBoolean = yield booleanFlagVariation(key, defaultVal, context, useDefaultContext);
                return resBoolean.value;
            case 'number':
                const resNumber = yield numberFlagVariation(key, defaultVal, context, useDefaultContext);
                return resNumber.value;
            case 'string':
                const resString = yield stringFlagVariation(key, defaultVal, context, useDefaultContext);
                return resString.value;
        }
    });
    // Create an object with SDK methods and state to be shared
    const sdkContextValue = {
        allFlags,
        booleanFlagVariation,
        numberFlagVariation,
        stringFlagVariation,
        initFeatureFlag,
        getFeatureFlag,
    };
    return jsx(NumeratorContext.Provider, { value: sdkContextValue, children: children });
};
// Custom hook to access the SDK context value
const useNumeratorContext = () => {
    const context = useContext(NumeratorContext);
    if (!context) {
        throw new Error('NumeratorClient must be used within a NumeratorProvider');
    }
    return context;
};

var FlagStatusEnum;
(function (FlagStatusEnum) {
    FlagStatusEnum["ON"] = "ON";
    FlagStatusEnum["OFF"] = "OFF";
})(FlagStatusEnum || (FlagStatusEnum = {}));
var FlagValueTypeEnum;
(function (FlagValueTypeEnum) {
    FlagValueTypeEnum["BOOLEAN"] = "BOOLEAN";
    FlagValueTypeEnum["STRING"] = "STRING";
    FlagValueTypeEnum["LONG"] = "LONG";
    FlagValueTypeEnum["DOUBLE"] = "DOUBLE";
})(FlagValueTypeEnum || (FlagValueTypeEnum = {}));

export { FlagStatusEnum, FlagValueTypeEnum, NumeratorClient, NumeratorProvider, useNumeratorContext };
//# sourceMappingURL=index.esm.js.map
