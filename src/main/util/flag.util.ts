import React from 'react';
import {
  FeatureFlagValue,
  FlagStatusEnum,
  FlagValueTypeEnum,
  VariationKeyType,
} from '../client/type.client';

/**
 * Check if a feature flag is ON.
 * @param featureFlagsValue - The record of feature flags and their values.
 * @param key - The key of the feature flag to check.
 * @returns True if the feature flag is ON, false otherwise.
 */
export const flagIsOn = (featureFlagsValue: Record<string, FeatureFlagValue>, key: string): boolean => {
  return featureFlagsValue[key]?.status === FlagStatusEnum.ON;
};

/**
 * Check if a feature flag is OFF.
 * @param featureFlagsValue - The record of feature flags and their values.
 * @param key - The key of the feature flag to check.
 * @returns True if the feature flag is OFF, false otherwise.
 */
export const flagIsOff = (featureFlagsValue: Record<string, FeatureFlagValue>, key: string): boolean => {
  const flag = featureFlagsValue[key];
  return !flag || flag?.status === FlagStatusEnum.OFF;
};

/**
 * Check if a feature flag's value equals a specified value.
 * @param featureFlagsValue - The record of feature flags and their values.
 * @param key - The key of the feature flag to check.
 * @param value - The value to compare with the feature flag's value.
 * @returns True if the feature flag's value equals the specified value, false otherwise.
 */
export const flagEqualsValue = (
  featureFlagsValue: Record<string, FeatureFlagValue>,
  key: string,
  value: any,
): boolean => {
  let variationKey: VariationKeyType = 'booleanValue';
  switch (featureFlagsValue[key].valueType) {
    case FlagValueTypeEnum.STRING:
      variationKey = 'stringValue';
      break;
    default:
      variationKey = 'booleanValue';
  }
  return featureFlagsValue[key]?.value[variationKey] === value;
};

/**
 * Check if a feature flag is ON and should render a React component.
 * @param featureFlagsValue - The record of feature flags and their values.
 * @param key - The key of the feature flag to check.
 * @param onComponent - The React component to render if the feature flag is ON.
 * @returns The specified React component if the feature flag is ON, otherwise an empty element.
 */
export const flagIsOnShouldRenderComponent = (
  featureFlagsValue: Record<string, FeatureFlagValue>,
  key: string,
  onComponent: React.ReactElement,
): React.ReactElement => {
  return featureFlagsValue[key]?.status === FlagStatusEnum.ON ? onComponent : React.createElement(React.Fragment);
};

/**
 * Renders the specified React component if the feature flag with the given key is in the "OFF" state.
 * Otherwise, it renders an empty fragment. If the feature flag is undefined, it also renders an empty fragment.
 * @param featureFlagsValue - The record of feature flag values.
 * @param key - The key of the feature flag to check.
 * @param offComponent - The React component to render when the feature flag is in the "OFF" state.
 * @returns The rendered React component or an empty fragment.
 */
export const flagIsOffShouldRenderComponent = (
  featureFlagsValue: Record<string, FeatureFlagValue>,
  key: string,
  offComponent: React.ReactElement,
): React.ReactElement => {
  const flag = featureFlagsValue[key];

  // Check if the feature flag is explicitly set to "OFF" or if it's undefined
  if (!flag || flag.status === FlagStatusEnum.OFF) {
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
export const flagEqualsValueShouldRenderComponent = (
  featureFlagsValue: Record<string, FeatureFlagValue>,
  key: string,
  value: any,
  renderComponent: React.ReactElement,
): React.ReactElement => {
  const flag = featureFlagsValue[key];

  // Check if the feature flag value matches the provided value or if it's undefined
  if (flag) {
    let variationKey: VariationKeyType;
    switch (flag.valueType) {
      case FlagValueTypeEnum.STRING:
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
export const flagIsOnShouldCallback = (
  featureFlagsValue: Record<string, FeatureFlagValue>,
  key: string,
  onCallback: () => void,
): void => {
  // Check if the feature flag value is ON
  const isOn = featureFlagsValue[key]?.status === FlagStatusEnum.ON;

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
export const flagIsOffShouldCallback = (
  featureFlagsValue: Record<string, FeatureFlagValue>,
  key: string,
  offCallback: () => void,
): void => {
  // Check if the feature flag value is OFF
  const isOff = !featureFlagsValue[key] || featureFlagsValue[key]?.status === FlagStatusEnum.OFF;

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
export const flagEqualsValueShouldCallback = (
  featureFlagsValue: Record<string, FeatureFlagValue>,
  key: string,
  value: any,
  equalsCallback: () => void,
): void => {
  let variationKey: VariationKeyType;
  switch (featureFlagsValue[key]?.valueType) {
    case FlagValueTypeEnum.STRING:
      variationKey = 'stringValue';
      break;
    default:
      variationKey = 'booleanValue';
  }
  // Check if the feature flag value equals the specified value
  const isEqualsValue = featureFlagsValue[key]?.value[variationKey] === value;

  // Execute the callback if the feature flag value equals the specified value and the callback is provided
  if (isEqualsValue && equalsCallback) {
    equalsCallback();
  }
};
