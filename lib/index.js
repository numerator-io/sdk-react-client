(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react/jsx-runtime'), require('react')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react/jsx-runtime', 'react'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Numerator = {}, global.jsxRuntime, global.react));
})(this, (function (exports, jsxRuntime, react) { 'use strict';

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


    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

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
    /**
     * Add records to another records
     * @param firstObject - The first records object.
     * @param secondObject  _ the second records object.
     */
    const areObjectsEqual = (firstObject, secondObject) => {
        if (!firstObject || !secondObject)
            return false;
        // Check if the number of keys are equal
        const keys1 = Object.keys(firstObject);
        const keys2 = Object.keys(secondObject);
        if (keys1.length !== keys2.length) {
            return false;
        }
        // Check if each key-value pair matches
        for (const key of keys1) {
            // Check if the key exists in both objects
            if (!(key in secondObject)) {
                return false;
            }
            // Check if the values are equal
            const value1 = firstObject[key];
            const value2 = secondObject[key];
            if (value1 !== value2) {
                // If the values are objects, recursively check them
                if (typeof value1 === 'object' && typeof value2 === 'object') {
                    if (!areObjectsEqual(value1, value2)) {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * Get value of key in headers
     * @param headers The headers.
     * @param key The key in headers.
     */
    const getHeaderValue = (headers, key) => {
        if (headers instanceof Headers) {
            return headers.get(key);
        }
        else if (headers && typeof headers === 'object') {
            return headers[key];
        }
        return null;
    };

    class ApiClient {
        constructor(config) {
            this.apiKey = config.apiKey;
            this.baseUrl = config.baseUrl || 'https://service-platform.numerator.io'; //'https://api.numerator.io/v1';
        }
        request(apiRequestOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const { method, endpoint, data, headers: headerRequest } = apiRequestOptions;
                const url = `${this.baseUrl}/${endpoint}`;
                const headers = Object.assign({ 'Content-Type': 'application/json', [ApiClient.API_KEY_HEADER]: this.apiKey }, headerRequest);
                try {
                    const response = yield fetch(url, {
                        method,
                        headers,
                        body: JSON.stringify(data),
                    });
                    // Handle 304 Not Modified response
                    if (response.status === 304) {
                        return {};
                    }
                    // Check if the request was successful
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const jsonData = yield response.json();
                    return { data: snakeToCamel(jsonData), error: undefined, headers: response.headers };
                }
                catch (error) {
                    return { data: undefined, error };
                }
            });
        }
    }
    ApiClient.API_KEY_HEADER = 'X-NUM-API-KEY';

    const END_POINT_BASE = 'api/v1/sdk/feature-flag';
    // Get all feature flags config associated with the project
    const END_POINT_FEATURE_FLAG_CONFIG_LISTING = `${END_POINT_BASE}/listing`;
    // Get the config of a feature flag by key
    const END_POINT_FEATURE_FLAG_CONFIG_BY_KEY = `${END_POINT_BASE}/detail-by-key`;
    // Get the value of the feature flag by key
    const END_POINT_FEATURE_FLAG_VALUE_BY_KEY = `${END_POINT_BASE}/by-key`;
    // Get the value of flag collection by context
    const END_POINT_FEATURE_FLAG_COLLECTION_POLLING = `${END_POINT_BASE}/polling`;

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
                    const url = `${END_POINT_FEATURE_FLAG_CONFIG_BY_KEY}?key=${key}`;
                    const response = yield this.apiClient.request({
                        method: 'GET',
                        endpoint: url,
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
        fetchPollingFlag(context, properties = {}, eTag) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const headers = eTag ? { 'If-None-Match': eTag } : {};
                    // Prepare the request data
                    const data = { context };
                    // Only add properties if it's not empty
                    if (Object.keys(properties).length > 0) {
                        data.properties = properties;
                    }
                    const response = yield this.apiClient.request({
                        method: 'POST',
                        headers: headers,
                        endpoint: END_POINT_FEATURE_FLAG_COLLECTION_POLLING,
                        data: data,
                    });
                    if (response.error) {
                        console.warn('Error fetching featureFlagCollectionPolling due to: [', response.error, ']');
                        return Promise.reject(response.error);
                    }
                    // Use the utility function to get the ETag header value safely
                    const etag = getHeaderValue(response.headers, 'ETag');
                    return { flags: (_a = response.data) === null || _a === void 0 ? void 0 : _a.flags, etag: etag };
                }
                catch (error) {
                    console.warn('Error fetching featureFlagCollectionPolling due to: [', error, ']');
                    return Promise.reject(error);
                }
            });
        }
    }

    const POLLING_INTERVAL$1 = 30000; // 30 seconds
    class NumeratorFlagsManager {
        constructor(configClient, defaultContext, properties, loadPolling = true) {
            this.cacheFlags = {};
            this.flags = {};
            this.updateListeners = [];
            this.errorListeners = [];
            this.numeratorClient = this.initializeNumeratorClient(configClient);
            this.defaultContext = defaultContext;
            this.properties = properties;
            this.isPolling = loadPolling;
            this.configClient = configClient;
            if (loadPolling) {
                this.startPolling();
            }
        }
        initializeNumeratorClient(configClient) {
            return new NumeratorClient({
                apiKey: configClient.apiKey,
                baseUrl: configClient.baseUrl || 'https://service-platform.numerator.io',
                pollingInterval: configClient.pollingInterval || POLLING_INTERVAL$1,
            });
        }
        fetchPollingFeatureFlag() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield this.numeratorClient.fetchPollingFlag(this.defaultContext, this.properties, this.currentEtag);
                    if (result.flags) {
                        const newCache = result.flags.reduce((acc, flag) => {
                            acc[flag.key] = flag;
                            return acc;
                        }, {});
                        this.cacheFlags = newCache;
                        this.currentEtag = result.etag;
                        this.updateListeners.forEach((listener) => listener(newCache)); // Notify all update listeners
                    }
                }
                catch (error) {
                    this.errorListeners.forEach((listener) => listener(this.cacheFlags, error)); // Notify all error listeners
                }
            });
        }
        flagValueByKey(key, context) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.numeratorClient.getFeatureFlagByKey({ key, context });
            });
        }
        featureFlags() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.numeratorClient.allFeatureFlagsConfig();
            });
        }
        booleanFlagVariationDetail(key, defaultVal, context = undefined, useDefaultContext = true) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const requestContext = context !== null && context !== void 0 ? context : (useDefaultContext ? this.defaultContext : {});
                    const variation = yield this.flagValueByKey(key, requestContext);
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
        }
        numberFlagVariationDetail(key, defaultVal, context = undefined, useDefaultContext = true) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const requestContext = context !== null && context !== void 0 ? context : (useDefaultContext ? this.defaultContext : {});
                    const variation = yield this.flagValueByKey(key, requestContext);
                    return {
                        key: key,
                        value: (_b = (_a = variation.value.longValue) !== null && _a !== void 0 ? _a : variation.value.doubleValue) !== null && _b !== void 0 ? _b : 0,
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
        }
        stringFlagVariationDetail(key, defaultVal, context = undefined, useDefaultContext = true) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const requestContext = context !== null && context !== void 0 ? context : (useDefaultContext ? this.defaultContext : {});
                    const variation = yield this.flagValueByKey(key, requestContext);
                    return {
                        key: key,
                        value: (_a = variation.value.stringValue) !== null && _a !== void 0 ? _a : '',
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
        }
        initFeatureFlag(key, defaultVal) {
            this.flags[key] = defaultVal;
        }
        getFeatureFlag(key, defaultVal, context = undefined, useDefaultContext = true) {
            var _a, _b, _c, _d;
            return __awaiter(this, void 0, void 0, function* () {
                const defaultValue = this.flags[key];
                const hasCacheValue = !!context && this.cacheFlags.hasOwnProperty(key) && areObjectsEqual(context, this.defaultContext);
                switch (typeof defaultVal) {
                    case 'boolean':
                        if (hasCacheValue) {
                            return (_a = this.cacheFlags[key].value.booleanValue) !== null && _a !== void 0 ? _a : defaultValue;
                        }
                        const resBoolean = yield this.booleanFlagVariationDetail(key, defaultVal, context, useDefaultContext);
                        return resBoolean.value;
                    case 'number':
                        if (hasCacheValue) {
                            return (_c = (_b = this.cacheFlags[key].value.longValue) !== null && _b !== void 0 ? _b : this.cacheFlags[key].value.doubleValue) !== null && _c !== void 0 ? _c : defaultValue;
                        }
                        const resNumber = yield this.numberFlagVariationDetail(key, defaultVal, context, useDefaultContext);
                        return resNumber.value;
                    case 'string':
                        if (hasCacheValue) {
                            return (_d = this.cacheFlags[key].value.stringValue) !== null && _d !== void 0 ? _d : defaultValue;
                        }
                        const resString = yield this.stringFlagVariationDetail(key, defaultVal, context, useDefaultContext);
                        return resString.value;
                    default:
                        throw Error('Unsupported flag type');
                }
            });
        }
        startPolling() {
            this.isPolling = true;
            if (this.pollingIntervalId) {
                clearInterval(this.pollingIntervalId);
            }
            /**
             * Executes the fetchPollingFeatureFlag method after a delay of 10 milliseconds.
             * This is done using the setTimeout function, which schedules a function to be run after a specified delay.
             * The delay is introduced to ensure that all the initializations are completed before the fetch operation begins.
             * Without this delay, there could be a chance that the fetch operation might execute before the necessary initializations,
             * leading to potential errors or unexpected behavior.
             */
            setTimeout(() => this.fetchPollingFeatureFlag(), 10);
            this.pollingIntervalId = setInterval(() => this.fetchPollingFeatureFlag(), this.configClient.pollingInterval || POLLING_INTERVAL$1);
        }
        stopPolling() {
            this.isPolling = false;
            if (this.pollingIntervalId) {
                clearInterval(this.pollingIntervalId);
            }
            this.cacheFlags = {};
        }
        restartPolling() {
            this.stopPolling();
            this.startPolling();
        }
        // Register and unregister update listeners
        handleFlagUpdated(callback) {
            this.updateListeners.push(callback);
            return () => {
                this.updateListeners = this.updateListeners.filter((c) => c !== callback);
            };
        }
        // Register and unregister error listeners
        handleFlagUpdatedError(callback) {
            this.errorListeners.push(callback);
            return () => {
                this.errorListeners = this.errorListeners.filter((c) => c !== callback);
            };
        }
        getCacheFlags() {
            return this.cacheFlags;
        }
        getIsPolling() {
            return this.isPolling;
        }
    }

    // Create a context for the SDK
    const NumeratorContext = react.createContext(undefined);

    function useDefaultContext(context, setContext) {
        const getDefaultContext = () => {
            return context;
        };
        const clearDefaultContext = () => {
            setContext({});
        };
        const addDefaultContextValue = (key, value) => {
            const updatedContext = Object.assign({}, context);
            updatedContext[key] = value;
            setContext(updatedContext);
        };
        const removeDefaultContextValue = (key) => {
            const updatedContext = Object.assign({}, context);
            delete updatedContext[key];
            setContext(updatedContext);
        };
        return {
            getDefaultContext,
            clearDefaultContext,
            addDefaultContextValue,
            removeDefaultContextValue
        };
    }

    const POLLING_INTERVAL = 30000; // 30 seconds
    const initializeNumeratorClient = (configClient) => {
        const numeratorClient = new NumeratorClient({
            apiKey: configClient.apiKey,
            baseUrl: configClient.baseUrl || 'https://service-platform.numerator.io',
            pollingInterval: configClient.pollingInterval || POLLING_INTERVAL,
        });
        return numeratorClient;
    };
    // Create a provider component
    const NumeratorProvider = ({ children, configClient, defaultContext, loadPolling = true, }) => {
        // Initialize the SDK client
        const numeratorClient = initializeNumeratorClient(configClient);
        const [cacheFlags, setCacheFlags] = react.useState({});
        const [flags, setFlags] = react.useState({});
        const [defaultContextValues, setDefaultContextValues] = react.useState(defaultContext);
        const [currentEtag, setCurrentEtag] = react.useState();
        const [isPolling, setIsPolling] = react.useState(loadPolling);
        const [updateListeners, setUpdateListeners] = react.useState([]);
        const [errorListeners, setErrorListeners] = react.useState([]);
        const fetchPollingFeatureFlag = react.useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const result = yield numeratorClient.fetchPollingFlag(defaultContextValues, {}, currentEtag);
                if (result.flags) {
                    // 200 OK
                    const newCache = result.flags.reduce((acc, flag) => {
                        acc[flag.key] = flag;
                        return acc;
                    }, {});
                    setCacheFlags(newCache);
                    setCurrentEtag(result.etag);
                    updateListeners.forEach((listener) => listener(newCache)); // Notify all update listeners
                }
            }
            catch (error) {
                errorListeners.forEach((listener) => listener(cacheFlags, error)); // Notify all error listeners
            }
        }), [numeratorClient, defaultContextValues, currentEtag, updateListeners, errorListeners]);
        const flagValueByKey = (key, context) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield numeratorClient.getFeatureFlagByKey({ key, context });
            return result;
        });
        const featureFlags = () => __awaiter(void 0, void 0, void 0, function* () {
            const allFlagsConfig = yield numeratorClient.allFeatureFlagsConfig();
            return allFlagsConfig;
        });
        const booleanFlagVariationDetail = (key, defaultVal, context = undefined, useDefaultContext = true) => __awaiter(void 0, void 0, void 0, function* () {
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
        const numberFlagVariationDetail = (key, defaultVal, context = undefined, useDefaultContext = true) => __awaiter(void 0, void 0, void 0, function* () {
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
        const stringFlagVariationDetail = (key, defaultVal, context = undefined, useDefaultContext = true) => __awaiter(void 0, void 0, void 0, function* () {
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
            setFlags((prevFlags) => (Object.assign(Object.assign({}, prevFlags), { [key]: defaultVal })));
        };
        const getFeatureFlag = (key, defaultVal, context = undefined, useDefaultContext = true) => __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f, _g, _h;
            const defaultValue = flags[key];
            const hasCacheValue = !!context && cacheFlags.hasOwnProperty(key) && areObjectsEqual(context, defaultContext);
            switch (typeof defaultVal) {
                case 'boolean':
                    if (hasCacheValue) {
                        return (_e = cacheFlags[key].value.booleanValue) !== null && _e !== void 0 ? _e : defaultValue;
                    }
                    const resBoolean = yield booleanFlagVariationDetail(key, defaultVal, context, useDefaultContext);
                    return resBoolean.value;
                case 'number':
                    if (hasCacheValue) {
                        return (_g = (_f = cacheFlags[key].value.longValue) !== null && _f !== void 0 ? _f : cacheFlags[key].value.doubleValue) !== null && _g !== void 0 ? _g : defaultValue;
                    }
                    const resNumber = yield numberFlagVariationDetail(key, defaultVal, context, useDefaultContext);
                    return resNumber.value;
                case 'string':
                    if (hasCacheValue) {
                        return (_h = cacheFlags[key].value.stringValue) !== null && _h !== void 0 ? _h : defaultValue;
                    }
                    const resString = yield stringFlagVariationDetail(key, defaultVal, context, useDefaultContext);
                    return resString.value;
                default:
                    throw Error('Unsupported flag type');
            }
        });
        const { getDefaultContext, clearDefaultContext, addDefaultContextValue, removeDefaultContextValue } = useDefaultContext(defaultContextValues, setDefaultContextValues);
        const startPolling = () => {
            setIsPolling(true);
        };
        const stopPolling = () => {
            setIsPolling(false);
            setCacheFlags({});
        };
        const restartPolling = react.useCallback(() => {
            stopPolling();
            startPolling();
        }, [stopPolling, startPolling]);
        // Register and unregister update listeners
        const handleFlagUpdated = react.useCallback((callback) => {
            setUpdateListeners((prev) => [...prev, callback]);
            return () => setUpdateListeners((prev) => prev.filter((c) => c !== callback));
        }, []);
        // Register and unregister error listeners
        const handleFlagUpdatedError = react.useCallback((callback) => {
            setErrorListeners((prev) => [...prev, callback]);
            return () => setErrorListeners((prev) => prev.filter((c) => c !== callback));
        }, []);
        react.useEffect(() => {
            let timeIntervalId;
            if (isPolling) {
                timeIntervalId = setInterval(fetchPollingFeatureFlag, configClient.pollingInterval || POLLING_INTERVAL);
            }
            else {
                clearInterval(timeIntervalId);
            }
            return () => clearInterval(timeIntervalId);
        }, [isPolling, fetchPollingFeatureFlag]);
        // Create an object with SDK methods and state to be shared
        const sdkContextValue = react.useMemo(() => ({
            featureFlags,
            flagValueByKey,
            booleanFlagVariationDetail,
            numberFlagVariationDetail,
            stringFlagVariationDetail,
            initFeatureFlag,
            getFeatureFlag,
            getDefaultContext,
            clearDefaultContext,
            addDefaultContextValue,
            removeDefaultContextValue,
            startPolling,
            stopPolling,
            restartPolling,
            fetchPollingFeatureFlag,
            handleFlagUpdated,
            handleFlagUpdatedError,
            cacheFlags,
            isPolling: isPolling,
        }), [cacheFlags, isPolling]);
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

    exports.FlagStatusEnum = void 0;
    (function (FlagStatusEnum) {
        FlagStatusEnum["ON"] = "ON";
        FlagStatusEnum["OFF"] = "OFF";
    })(exports.FlagStatusEnum || (exports.FlagStatusEnum = {}));
    exports.FlagValueTypeEnum = void 0;
    (function (FlagValueTypeEnum) {
        FlagValueTypeEnum["BOOLEAN"] = "BOOLEAN";
        FlagValueTypeEnum["STRING"] = "STRING";
        FlagValueTypeEnum["LONG"] = "LONG";
        FlagValueTypeEnum["DOUBLE"] = "DOUBLE";
    })(exports.FlagValueTypeEnum || (exports.FlagValueTypeEnum = {}));

    let mockedFlags = [];
    /**
     * Sets the mocked feature flags to the provided array of flags.
     * If a flag's context is not provided, it defaults to an empty object.
     *
     * @param flags An array of MockFlag objects representing the feature flags to be mocked.
     */
    const mockFlags = (flags) => {
        flags.forEach((flag) => {
            if (!flag.context) {
                flag.context = {}; // Set context to an empty object if it's undefined
            }
        });
        mockedFlags = flags;
    };
    /**
     * Adds a mocked feature flag to the list of mocked flags.
     * If the flag's context is not provided, it defaults to an empty object.
     *
     * @param flag The MockFlag object representing the feature flag to be added.
     */
    const addMockedFlag = (flag) => {
        if (!flag.context) {
            flag.context = {}; // Set context to an empty object if it's undefined
        }
        mockedFlags.push(flag);
    };
    /**
     * Removes a mocked feature flag with the specified key and context from the list of mocked flags.
     * If no context is provided, it removes the flag regardless of its context.
     *
     * @param key The key of the feature flag to be removed.
     * @param context (Optional) The context of the feature flag to be removed.
     */
    const removeMockedFlag = (key, context) => {
        mockedFlags = context
            ? mockedFlags.filter((flag) => !(flag.key === key && areObjectsEqual(flag.context, context)))
            : mockedFlags.filter((flag) => flag.key !== key);
    };
    // Mock NumeratorProvider
    const useMockNumeratorProvider = (props = {}) => {
        var _a;
        let cacheFlags = {};
        let defaultContext = (_a = props.defaultContext) !== null && _a !== void 0 ? _a : {};
        // Define base mock implementations for booleanFlagVariationDetail, numberFlagVariationDetail, and stringFlagVariationDetail
        const flagVariationDetail = jest.fn((key, defaultVal, context, useDefaultContext = true) => __awaiter(void 0, void 0, void 0, function* () {
            const requestContext = context !== null && context !== void 0 ? context : (useDefaultContext ? defaultContext : {});
            const variation = mockedFlags.find((flag) => flag.key === key && areObjectsEqual(flag.context, requestContext));
            if (variation) {
                return {
                    key: key,
                    value: variation.value,
                    reason: {},
                };
            }
            return {
                key: key,
                value: defaultVal,
                reason: {},
            };
        }));
        // Define mock implementation for getFeatureFlag
        const getFeatureFlag = jest.fn((key, defaultVal, context, useDefaultContext = true) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const hasCacheValue = !!context && cacheFlags.hasOwnProperty(key) && areObjectsEqual(context, props.defaultContext);
            switch (typeof defaultVal) {
                case 'boolean':
                    if (hasCacheValue) {
                        return cacheFlags[key].value.booleanValue;
                    }
                    const resBoolean = yield flagVariationDetail(key, defaultVal, context, useDefaultContext);
                    return resBoolean.value;
                case 'number':
                    if (hasCacheValue) {
                        return (_b = cacheFlags[key].value.longValue) !== null && _b !== void 0 ? _b : cacheFlags[key].value.doubleValue;
                    }
                    const resNumber = yield flagVariationDetail(key, defaultVal, context, useDefaultContext);
                    return resNumber.value;
                case 'string':
                    if (hasCacheValue) {
                        return cacheFlags[key].value.stringValue;
                    }
                    const resString = yield flagVariationDetail(key, defaultVal, context, useDefaultContext);
                    return resString.value;
                default:
                    throw new Error('Unsupported flag type');
            }
        }));
        return {
            /**
             * Retrieve the feature flag value, working the same as the function provided in useNumeratorContext.
             *
             * @param key The key of the feature flag.
             * @param defaultVal The default value to return if the feature flag is not found.
             * @param context (Optional) The context for the feature flag.
             * @param useDefaultContext (Optional) Specifies whether to use the default context if no context is provided. Defaults to true.
             */
            getFeatureFlag,
            /**
             * Retrieve the feature flag type BOOLEAN, working the same as the function provided in useNumeratorContext.
             *
             * @param key The key of the feature flag.
             * @param defaultVal The default value to return if the feature flag is not found.
             * @param context (Optional) The context for the feature flag.
             * @param useDefaultContext (Optional) Specifies whether to use the default context if no context is provided. Defaults to true.
             */
            booleanFlagVariationDetail: flagVariationDetail,
            /**
             * Retrieve the feature flag type NUMBER (LONG or DOUBLE), working the same as the function provided in useNumeratorContext.
             *
             * @param key The key of the feature flag.
             * @param defaultVal The default value to return if the feature flag is not found.
             * @param context (Optional) The context for the feature flag.
             * @param useDefaultContext (Optional) Specifies whether to use the default context if no context is provided. Defaults to true.
             */
            numberFlagVariationDetail: flagVariationDetail,
            /**
             * Retrieve the feature flag type STRING, working the same as the function provided in useNumeratorContext.
             *
             * @param key The key of the feature flag.
             * @param defaultVal The default value to return if the feature flag is not found.
             * @param context (Optional) The context for the feature flag.
             * @param useDefaultContext (Optional) Specifies whether to use the default context if no context is provided. Defaults to true.
             */
            stringFlagVariationDetail: flagVariationDetail,
            /**
             * Retrieve the default context, working the same as the function provided in useNumeratorContext.
             */
            getDefaultContext: jest.fn(() => defaultContext),
            /**
             * Clear default context, working the same as the function provided in useNumeratorContext.
             */
            clearDefaultContext: jest.fn(() => (defaultContext = {})),
            /**
             * Add another default context, working the same as the function provided in useNumeratorContext.
             */
            addDefaultContextValue: jest.fn((key, value) => (defaultContext = Object.assign(Object.assign({}, defaultContext), { [key]: value }))),
            /**
             * Remove an existing default context, working the same as the function provided in useNumeratorContext.
             */
            removeDefaultContextValue: jest.fn((key) => {
                const _a = defaultContext, _b = key; _a[_b]; const newDefaultContext = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                defaultContext = newDefaultContext;
            }),
            /**
             * Update cache flags for faster retrieval of flag with default context, working the same as the function provided in useNumeratorContext.
             */
            fetchPollingFeatureFlag: jest.fn(() => __awaiter(void 0, void 0, void 0, function* () {
                const result = mockedFlags.filter((flag) => areObjectsEqual(flag.context, defaultContext));
                const newCache = {};
                result.forEach((flag) => {
                    newCache[flag.key] = flag;
                });
                cacheFlags = newCache;
            })),
            /**
             * Currently not supported, but you might define on your own.
             */
            initFeatureFlag: jest.fn(),
            /**
             * Currently not supported, but you might define on your own.
             */
            featureFlags: jest.fn(),
            /**
             * Currently not supported, but you might define on your own.
             */
            flagValueByKey: jest.fn(),
            /**
             * Currently not supported, but you might define on your own.
             */
            startPolling: jest.fn(),
            /**
             * Currently not supported, but you might define on your own.
             */
            stopPolling: jest.fn(),
            /**
             * Currently not supported, but you might define on your own.
             */
            restartPolling: jest.fn(),
            /**
             * Currently not supported, but you might define on your own.
             */
            handleFlagUpdated: jest.fn(),
            /**
             * Currently not supported, but you might define on your own.
             */
            handleFlagUpdatedError: jest.fn(),
            /**
             * Current cache flags.
             */
            cacheFlags: cacheFlags,
        };
    };
    /**
     * Resets the mocked flags array and mocks for NumeratorProvider.
     *
     * It clears the mockedFlags array and resets all mocked functions provided by useMockNumeratorProvider.
     */
    const resetNumeratorMocks = () => {
        // Reset mockedFlags array
        mockedFlags = [];
        // Reset mocks for NumeratorProvider
        const mockProvider = useMockNumeratorProvider();
        Object.values(mockProvider).forEach((mockFn) => {
            if (typeof mockFn.mock !== 'undefined') {
                mockFn.mockReset();
            }
        });
    };

    exports.NumeratorClient = NumeratorClient;
    exports.NumeratorFlagsManager = NumeratorFlagsManager;
    exports.NumeratorProvider = NumeratorProvider;
    exports.addMockedFlag = addMockedFlag;
    exports.mockFlags = mockFlags;
    exports.removeMockedFlag = removeMockedFlag;
    exports.resetNumeratorMocks = resetNumeratorMocks;
    exports.useMockNumeratorProvider = useMockNumeratorProvider;
    exports.useNumeratorContext = useNumeratorContext;

}));
//# sourceMappingURL=index.js.map
