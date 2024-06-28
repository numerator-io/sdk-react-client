import NumeratorClient from '@/client';
import {
  ConfigClient,
  FeatureFlagConfig,
  FlagCollection,
  FlagEvaluationDetail,
  FlagVariationValue,
} from '@/client/type.client';
import {areObjectsEqual} from '@/util';
import {
  FlagUpdatedCallback,
  FlagUpdatedErrorCallback
} from '@/provider/type.provider';

const POLLING_INTERVAL = 30000; // 30 seconds

class NumeratorFlagsManager {
  private isPolling: boolean;
  private cacheFlags: Record<string, FlagCollection> = {};
  private numeratorClient: NumeratorClient;
  private flags: Record<string, any> = {};
  private defaultContext: Record<string, any>;
  private properties: Record<string, any>;
  private configClient: ConfigClient;
  private currentEtag?: string;
  private updateListeners: FlagUpdatedCallback[] = [];
  private errorListeners: FlagUpdatedErrorCallback[] = [];
  private pollingIntervalId?: NodeJS.Timeout;

  constructor(configClient: ConfigClient, defaultContext: Record<string, any>, properties: Record<string, any>, loadPolling = true) {
    this.numeratorClient = this.initializeNumeratorClient(configClient);
    this.defaultContext = defaultContext;
    this.properties = properties;
    this.isPolling = loadPolling;
    this.configClient = configClient;
    if (loadPolling) {
      this.startPolling();
    }
  }

  private initializeNumeratorClient(configClient: ConfigClient): NumeratorClient {
    return new NumeratorClient({
      apiKey: configClient.apiKey,
      baseUrl: configClient.baseUrl || 'https://service-platform.numerator.io',
      pollingInterval: configClient.pollingInterval || POLLING_INTERVAL,
    });
  }

  private async fetchPollingFeatureFlag() {
    try {
      const result = await this.numeratorClient.fetchPollingFlag(this.defaultContext, this.properties, this.currentEtag);
      if (result.flags) {
        const newCache = result.flags.reduce(
          (acc, flag) => {
            acc[flag.key] = flag;
            return acc;
          },
          {} as Record<string, any>,
        );
        this.cacheFlags = newCache;
        this.currentEtag = result.etag;
        this.updateListeners.forEach((listener) => listener(newCache)); // Notify all update listeners
      }
    } catch (error) {
      this.errorListeners.forEach((listener) => listener(this.cacheFlags, error)); // Notify all error listeners
    }
  }

  async flagValueByKey(key: string, context: Record<string, any> | undefined): Promise<FlagVariationValue> {
    return await this.numeratorClient.getFeatureFlagByKey({key, context});
  }

  async featureFlags(): Promise<FeatureFlagConfig[]> {
    return this.numeratorClient.allFeatureFlagsConfig();
  }

  async booleanFlagVariationDetail(
    key: string,
    defaultVal: boolean,
    context: Record<string, any> | undefined = undefined,
    useDefaultContext: boolean = true,
  ): Promise<FlagEvaluationDetail<boolean>> {
    try {
      const requestContext = context ?? (useDefaultContext ? this.defaultContext : {});
      const variation = await this.flagValueByKey(key, requestContext);
      return {
        key: key,
        value: variation.value.booleanValue ?? false,
        reason: {},
      };
    } catch (e) {
      return {
        key: key,
        value: defaultVal,
        reason: {},
      };
    }
  }

  async numberFlagVariationDetail(
    key: string,
    defaultVal: number,
    context: Record<string, any> | undefined = undefined,
    useDefaultContext: boolean = true,
  ): Promise<FlagEvaluationDetail<number>> {
    try {
      const requestContext = context ?? (useDefaultContext ? this.defaultContext : {});
      const variation = await this.flagValueByKey(key, requestContext);
      return {
        key: key,
        value: variation.value.longValue ?? variation.value.doubleValue ?? 0,
        reason: {},
      };
    } catch (e) {
      return {
        key: key,
        value: defaultVal,
        reason: {},
      };
    }
  }

  async stringFlagVariationDetail(
    key: string,
    defaultVal: string,
    context: Record<string, any> | undefined = undefined,
    useDefaultContext: boolean = true,
  ): Promise<FlagEvaluationDetail<string>> {
    try {
      const requestContext = context ?? (useDefaultContext ? this.defaultContext : {});
      const variation = await this.flagValueByKey(key, requestContext);
      return {
        key: key,
        value: variation.value.stringValue ?? '',
        reason: {},
      };
    } catch (e) {
      return {
        key: key,
        value: defaultVal,
        reason: {},
      };
    }
  }

  initFeatureFlag(key: string, defaultVal: any) {
    this.flags[key] = defaultVal;
  }

  async getFeatureFlag(
    key: string,
    defaultVal: any,
    context: Record<string, any> | undefined = undefined,
    useDefaultContext: boolean = true,
  ): Promise<any> {
    const defaultValue = this.flags[key];
    const hasCacheValue = !!context && this.cacheFlags.hasOwnProperty(key) && areObjectsEqual(context, this.defaultContext);
    switch (typeof defaultVal) {
      case 'boolean':
        if (hasCacheValue) {
          return (this.cacheFlags[key].value.booleanValue as boolean) ?? defaultValue;
        }
        const resBoolean = await this.booleanFlagVariationDetail(key, defaultVal, context, useDefaultContext);
        return resBoolean.value as boolean;
      case 'number':
        if (hasCacheValue) {
          return this.cacheFlags[key].value.longValue ?? (this.cacheFlags[key].value.doubleValue as number) ?? defaultValue;
        }
        const resNumber = await this.numberFlagVariationDetail(key, defaultVal, context, useDefaultContext);
        return resNumber.value as number;

      case 'string':
        if (hasCacheValue) {
          return (this.cacheFlags[key].value.stringValue as string) ?? defaultValue;
        }
        const resString = await this.stringFlagVariationDetail(key, defaultVal, context, useDefaultContext);
        return resString.value as string;
      default:
        throw Error('Unsupported flag type');
    }
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
    this.pollingIntervalId = setInterval(() => this.fetchPollingFeatureFlag(), this.configClient.pollingInterval || POLLING_INTERVAL);
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
  handleFlagUpdated(callback: FlagUpdatedCallback) {
    this.updateListeners.push(callback);
    return () => {
      this.updateListeners = this.updateListeners.filter((c) => c !== callback);
    };
  }

  // Register and unregister error listeners
  handleFlagUpdatedError(callback: FlagUpdatedErrorCallback) {
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

export default NumeratorFlagsManager;
