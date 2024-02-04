'use strict';

var axios = require('axios');
var jsxRuntime = require('react/jsx-runtime');
var React = require('react');

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
const NumeratorContext = React.createContext(undefined);

/**
 * Deep copy an object using JSON.
 * @param obj - The object to be deep copied.
 * @returns A deep copy of the input object.
 */
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
/**
 * Asynchronous sleep function using Promises.
 * @param milliseconds - The duration to sleep in milliseconds.
 * @returns A Promise that resolves after the specified duration.
 */
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
/**
 * Map an array of objects to a Record using a specific key.
 * @param array - The array of objects to be mapped.
 * @returns A Record where keys are extracted from the 'key' property of each object.
 */
const mapArrayToRecord = (array) => {
    return Object.fromEntries(array.map((item) => [item.key, item]));
};
/**
 * Create a promise with a timeout.
 * @param promise - The original promise to be wrapped with a timeout.
 * @param timeout - The timeout duration in milliseconds.
 * @returns A Promise that resolves when the original promise resolves or rejects with a timeout error.
 */
const withTimeout = (promise, timeout) => {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), timeout));
    return Promise.race([promise, timeoutPromise]);
};

exports.FlagStatusEnum = void 0;
(function (FlagStatusEnum) {
    FlagStatusEnum["ON"] = "ON";
    FlagStatusEnum["OFF"] = "OFF";
})(exports.FlagStatusEnum || (exports.FlagStatusEnum = {}));
exports.FlagValueTypeEnum = void 0;
(function (FlagValueTypeEnum) {
    FlagValueTypeEnum["BOOLEAN"] = "BOOLEAN";
    FlagValueTypeEnum["STRING"] = "STRING";
})(exports.FlagValueTypeEnum || (exports.FlagValueTypeEnum = {}));

/**
 * Check if a feature flag is ON.
 * @param featureFlagsValue - The record of feature flags and their values.
 * @param key - The key of the feature flag to check.
 * @returns True if the feature flag is ON, false otherwise.
 */
const flagIsOn = (featureFlagsValue, key) => {
    var _a;
    return ((_a = featureFlagsValue[key]) === null || _a === void 0 ? void 0 : _a.status) === exports.FlagStatusEnum.ON;
};
/**
 * Check if a feature flag is OFF.
 * @param featureFlagsValue - The record of feature flags and their values.
 * @param key - The key of the feature flag to check.
 * @returns True if the feature flag is OFF, false otherwise.
 */
const flagIsOff = (featureFlagsValue, key) => {
    const flag = featureFlagsValue[key];
    return !flag || (flag === null || flag === void 0 ? void 0 : flag.status) === exports.FlagStatusEnum.OFF;
};
/**
 * Check if a feature flag's value equals a specified value.
 * @param featureFlagsValue - The record of feature flags and their values.
 * @param key - The key of the feature flag to check.
 * @param value - The value to compare with the feature flag's value.
 * @returns True if the feature flag's value equals the specified value, false otherwise.
 */
const flagEqualsValue = (featureFlagsValue, key, value) => {
    var _a;
    let variationKey = 'booleanValue';
    switch (featureFlagsValue[key].valueType) {
        case exports.FlagValueTypeEnum.STRING:
            variationKey = 'stringValue';
            break;
        default:
            variationKey = 'booleanValue';
    }
    return ((_a = featureFlagsValue[key]) === null || _a === void 0 ? void 0 : _a.value[variationKey]) === value;
};
/**
 * Check if a feature flag is ON and should render a React component.
 * @param featureFlagsValue - The record of feature flags and their values.
 * @param key - The key of the feature flag to check.
 * @param onComponent - The React component to render if the feature flag is ON.
 * @returns The specified React component if the feature flag is ON, otherwise an empty element.
 */
const flagIsOnShouldRenderComponent = (featureFlagsValue, key, onComponent) => {
    var _a;
    return ((_a = featureFlagsValue[key]) === null || _a === void 0 ? void 0 : _a.status) === exports.FlagStatusEnum.ON ? onComponent : React.createElement(React.Fragment);
};
/**
 * Renders the specified React component if the feature flag with the given key is in the "OFF" state.
 * Otherwise, it renders an empty fragment. If the feature flag is undefined, it also renders an empty fragment.
 * @param featureFlagsValue - The record of feature flag values.
 * @param key - The key of the feature flag to check.
 * @param offComponent - The React component to render when the feature flag is in the "OFF" state.
 * @returns The rendered React component or an empty fragment.
 */
const flagIsOffShouldRenderComponent = (featureFlagsValue, key, offComponent) => {
    const flag = featureFlagsValue[key];
    // Check if the feature flag is explicitly set to "OFF" or if it's undefined
    if (!flag || flag.status === exports.FlagStatusEnum.OFF) {
        return offComponent;
    }
    // Render an empty fragment if the feature flag is not in the "OFF" state
    return React.createElement(React.Fragment);
};
/**
 * Renders the specified React component if the value of the feature flag with the given key
 * matches the provided value. Otherwise, it renders an empty fragment.
 * If the feature flag is undefined, it also renders an empty fragment.
 * @param featureFlagsValue - The record of feature flag values.
 * @param key - The key of the feature flag to check.
 * @param value - The value to compare against.
 * @param renderComponent - The React component to render when the feature flag value matches the provided value.
 * @returns The rendered React component or an empty fragment.
 */
const flagEqualsValueShouldRenderComponent = (featureFlagsValue, key, value, renderComponent) => {
    const flag = featureFlagsValue[key];
    // Check if the feature flag value matches the provided value or if it's undefined
    if (flag) {
        let variationKey;
        switch (flag.valueType) {
            case exports.FlagValueTypeEnum.STRING:
                variationKey = 'stringValue';
                break;
            default:
                variationKey = 'booleanValue';
        }
        if (flag.value[variationKey] == value) {
            return renderComponent;
        }
    }
    // Render an empty fragment if the feature flag value doesn't match the provided value or if it's undefined
    return React.createElement(React.Fragment);
};
/**
 * Executes the provided callback if the value of the feature flag with the given key is ON.
 * If the feature flag is undefined or its value is not ON, the callback is not executed.
 * @param featureFlagsValue - The record of feature flag values.
 * @param key - The key of the feature flag to check.
 * @param onCallback - The callback function to execute when the feature flag value is ON.
 */
const flagIsOnShouldCallback = (featureFlagsValue, key, onCallback) => {
    var _a;
    // Check if the feature flag value is ON
    const isOn = ((_a = featureFlagsValue[key]) === null || _a === void 0 ? void 0 : _a.status) === exports.FlagStatusEnum.ON;
    // Execute the callback if the feature flag value is ON and the callback is provided
    if (isOn && onCallback) {
        onCallback();
    }
};
/**
 * Executes the provided callback if the value of the feature flag with the given key is OFF.
 * If the feature flag is undefined or its value is not OFF, the callback is not executed.
 * @param featureFlagsValue - The record of feature flag values.
 * @param key - The key of the feature flag to check.
 * @param offCallback - The callback function to execute when the feature flag value is OFF.
 */
const flagIsOffShouldCallback = (featureFlagsValue, key, offCallback) => {
    var _a;
    // Check if the feature flag value is OFF
    const isOff = !featureFlagsValue[key] || ((_a = featureFlagsValue[key]) === null || _a === void 0 ? void 0 : _a.status) === exports.FlagStatusEnum.OFF;
    // Execute the callback if the feature flag value is OFF and the callback is provided
    if (isOff && offCallback) {
        offCallback();
    }
};
/**
 * Executes the provided callback if the value of the feature flag with the given key equals the specified value.
 * If the feature flag is undefined or its value does not equal the specified value, the callback is not executed.
 * @param featureFlagsValue - The record of feature flag values.
 * @param key - The key of the feature flag to check.
 * @param value - The value to compare with the feature flag's value.
 * @param equalsCallback - The callback function to execute when the feature flag value equals the specified value.
 */
const flagEqualsValueShouldCallback = (featureFlagsValue, key, value, equalsCallback) => {
    var _a, _b;
    let variationKey;
    switch ((_a = featureFlagsValue[key]) === null || _a === void 0 ? void 0 : _a.valueType) {
        case exports.FlagValueTypeEnum.STRING:
            variationKey = 'stringValue';
            break;
        default:
            variationKey = 'booleanValue';
    }
    // Check if the feature flag value equals the specified value
    const isEqualsValue = ((_b = featureFlagsValue[key]) === null || _b === void 0 ? void 0 : _b.value[variationKey]) === value;
    // Execute the callback if the feature flag value equals the specified value and the callback is provided
    if (isEqualsValue && equalsCallback) {
        equalsCallback();
    }
};

const initializeNumeratorClient = (configClient) => {
    const numeratorClient = new NumeratorClient({
        apiKey: configClient.apiKey,
        baseUrl: configClient.baseUrl || 'https://service-platform.dev.numerator.io',
    });
    return numeratorClient;
};
// Create a provider component
const NumeratorProvider = ({ children, configClient, loadAllFlagsConfigOnMount, loadFeatureFlagsValueOnMount, }) => {
    // Initialize the SDK client
    const numeratorClient = initializeNumeratorClient(configClient);
    const [featureFlagsConfig, setFeatureFlagsConfig] = React.useState({});
    const [featureFlagsValue, setFeatureFlagsState] = React.useState({});
    const fetchAllFeatureFlagsConfig = () => __awaiter(void 0, void 0, void 0, function* () {
        const allFlagsConfig = yield numeratorClient.allFeatureFlagsConfig();
        setFeatureFlagsConfig(mapArrayToRecord(allFlagsConfig));
    });
    const fetchFeatureFlagConfig = ({ key }) => __awaiter(void 0, void 0, void 0, function* () {
        const flagConfigRes = yield numeratorClient.featureFlagConfigByKey(key);
        // Update the state directly with the new Record containing a single FeatureFlag
        setFeatureFlagsConfig((prevFeatureFlagsConfig) => (Object.assign(Object.assign({}, prevFeatureFlagsConfig), { [flagConfigRes.key]: flagConfigRes })));
    });
    const fetchFeatureFlagValue = ({ key, context }) => __awaiter(void 0, void 0, void 0, function* () {
        const flagValueRes = yield numeratorClient.featureFlagValueByKey({ key: key, context });
        // Update the state directly with the new Record containing a single FeatureFlagState
        setFeatureFlagsState((prevFeatureFlagsValue) => (Object.assign(Object.assign({}, prevFeatureFlagsValue), { [flagValueRes.key]: flagValueRes })));
    });
    // Create an object with SDK methods and state to be shared
    const sdkContextValue = {
        featureFlagsConfig,
        featureFlagsValue,
        fetchAllFeatureFlagsConfig,
        fetchFeatureFlagConfig,
        fetchFeatureFlagValue,
    };
    React.useEffect(() => {
        if (loadAllFlagsConfigOnMount) {
            fetchAllFeatureFlagsConfig();
        }
        if (loadFeatureFlagsValueOnMount && Object.keys(loadFeatureFlagsValueOnMount).length > 0) {
            Object.keys(loadFeatureFlagsValueOnMount).forEach((key) => {
                fetchFeatureFlagValue({ key, context: loadFeatureFlagsValueOnMount[key] });
            });
        }
    }, []);
    return jsxRuntime.jsx(NumeratorContext.Provider, { value: sdkContextValue, children: children });
};
// Custom hook to access the SDK context value
const useNumeratorContext = () => {
    const context = React.useContext(NumeratorContext);
    if (!context) {
        throw new Error('NumeratorClient must be used within a NumeratorProvider');
    }
    return context;
};

exports.NumeratorClient = NumeratorClient;
exports.NumeratorProvider = NumeratorProvider;
exports.deepCopy = deepCopy;
exports.flagEqualsValue = flagEqualsValue;
exports.flagEqualsValueShouldCallback = flagEqualsValueShouldCallback;
exports.flagEqualsValueShouldRenderComponent = flagEqualsValueShouldRenderComponent;
exports.flagIsOff = flagIsOff;
exports.flagIsOffShouldCallback = flagIsOffShouldCallback;
exports.flagIsOffShouldRenderComponent = flagIsOffShouldRenderComponent;
exports.flagIsOn = flagIsOn;
exports.flagIsOnShouldCallback = flagIsOnShouldCallback;
exports.flagIsOnShouldRenderComponent = flagIsOnShouldRenderComponent;
exports.mapArrayToRecord = mapArrayToRecord;
exports.sleep = sleep;
exports.useNumeratorContext = useNumeratorContext;
exports.withTimeout = withTimeout;
//# sourceMappingURL=index.cjs.js.map
