import NumeratorClient from '../client';
import { FeatureFlagConfig, FlagCollection, FlagEvaluationDetail } from '../client/type.client';
import { areObjectsEqual } from '../util/common.util';

function useFeatureFlag(
  numeratorClient: NumeratorClient,
  defaultContext: Record<string, any>,
  cacheFlags: Record<string, FlagCollection>,
  featureFlags: Record<string, any>,
  setFeatureFlags: React.Dispatch<React.SetStateAction<Record<string, any>>>,
) {

  const flagValueByKey = async (key: string, context: Record<string, any> | undefined) => {
    const result = await numeratorClient.getFeatureFlagByKey({ key, context });
    return result;
  };

  const allFlags = async (): Promise<FeatureFlagConfig[]> => {
    const allFlagsConfig = await numeratorClient.allFeatureFlagsConfig();
    return allFlagsConfig;
  };

  const booleanFlagVariation = async (
    key: string,
    defaultVal: boolean,
    context: Record<string, any> | undefined = undefined,
    useDefaultContext: boolean = true,
  ): Promise<FlagEvaluationDetail<boolean>> => {
    try {
      const requestContext = context ?? (useDefaultContext ? defaultContext : {});
      const variation = await flagValueByKey(key, requestContext);
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
  };

  const numberFlagVariation = async (
    key: string,
    defaultVal: number,
    context: Record<string, any> | undefined = undefined,
    useDefaultContext: boolean = true,
  ): Promise<FlagEvaluationDetail<number>> => {
    try {
      const requestContext = context ?? (useDefaultContext ? defaultContext : {});
      const variation = await flagValueByKey(key, requestContext);
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
  };

  const stringFlagVariation = async (
    key: string,
    defaultVal: string,
    context: Record<string, any> | undefined = undefined,
    useDefaultContext: boolean = true,
  ): Promise<FlagEvaluationDetail<string>> => {
    try {
      const requestContext = context ?? (useDefaultContext ? defaultContext : {});
      const variation = await flagValueByKey(key, requestContext);
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
  };

  const initFeatureFlag = (key: string, defaultVal: any) => {
    featureFlags[key] = defaultVal;
    setFeatureFlags(featureFlags);
  };

  const getFeatureFlag = async (
    key: string,
    context: Record<string, any> | undefined = undefined,
    useDefaultContext: boolean = true,
  ): Promise<any> => {
    const defaultVal = featureFlags[key];
    const hasCacheValue = !!context && cacheFlags.hasOwnProperty(key) && areObjectsEqual(context, defaultContext);
    switch (typeof defaultVal) {
      case 'boolean':
        if (hasCacheValue) {
          return (cacheFlags[key].value.booleanValue as boolean) ?? defaultVal;
        }
        const resBoolean = await booleanFlagVariation(key, defaultVal, context, useDefaultContext);
        return resBoolean.value as boolean;
      case 'number':
        if (hasCacheValue) {
          return cacheFlags[key].value.longValue ?? (cacheFlags[key].value.doubleValue as number) ?? defaultVal;
        }
        const resNumber = await numberFlagVariation(key, defaultVal, context, useDefaultContext);
        return resNumber.value as number;

      case 'string':
        if (hasCacheValue) {
          return (cacheFlags[key].value.stringValue as string) ?? defaultVal;
        }
        const resString = await stringFlagVariation(key, defaultVal, context, useDefaultContext);
        return resString.value as string;
      default:
        throw Error('Unsupported flag type');
    }
  };

  return {
    allFlags,
    booleanFlagVariation,
    numberFlagVariation,
    stringFlagVariation,
    initFeatureFlag,
    getFeatureFlag,
  };
}
