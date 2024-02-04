import React from 'react';
import { FeatureFlagValue, FlagStatusEnum, FlagValueTypeEnum } from '../../main';
import {
  flagIsOn,
  flagIsOff,
  flagEqualsValue,
  flagIsOnShouldRenderComponent,
  flagIsOffShouldRenderComponent,
  flagEqualsValueShouldRenderComponent,
  flagIsOnShouldCallback,
  flagIsOffShouldCallback,
  flagEqualsValueShouldCallback,
} from '../../main/util';

describe('Feature Flag Utility Functions', () => {
  const featureFlagsValue: Record<string, FeatureFlagValue> = {
    feature1: {
      key: 'feature1',
      status: FlagStatusEnum.ON,
      value: { stringValue: 'value1' },
      valueType: FlagValueTypeEnum.STRING,
    },
    feature2: {
      key: 'feature2',
      status: FlagStatusEnum.OFF,
      value: { stringValue: 'value2' },
      valueType: FlagValueTypeEnum.STRING,
    },
  };

  describe('flagIsOn', () => {
    it('should return true if the feature flag is ON', () => {
      expect(flagIsOn(featureFlagsValue, 'feature1')).toBe(true);
    });

    it('should return false if the feature flag is not ON', () => {
      expect(flagIsOn(featureFlagsValue, 'feature2')).toBe(false);
    });
  });

  describe('flagIsOff', () => {
    it('should return true if the feature flag is OFF', () => {
      expect(flagIsOff(featureFlagsValue, 'feature2')).toBe(true);
    });

    it('should return false if the feature flag is not OFF', () => {
      expect(flagIsOff(featureFlagsValue, 'feature1')).toBe(false);
    });
  });

  describe('flagEqualsValue', () => {
    it('should return true if the feature flag value equals the specified value', () => {
      expect(flagEqualsValue(featureFlagsValue, 'feature1', 'value1')).toBe(true);
    });

    it('should return false if the feature flag value does not equal the specified value', () => {
      expect(flagEqualsValue(featureFlagsValue, 'feature2', 'value1')).toBe(false);
    });
  });

  describe('flagIsOnShouldRenderComponent', () => {
    it('should render the component if the feature flag is ON', () => {
      const onComponent = React.createElement('<div>Rendered on ON</div>');
      const renderedComponent = flagIsOnShouldRenderComponent(featureFlagsValue, 'feature1', onComponent);
      expect(renderedComponent).toEqual(onComponent);
    });

    it('should render an empty fragment if the feature flag is not ON', () => {
      const onComponent = React.createElement('<div>Rendered on ON</div>');
      const renderedComponent = flagIsOnShouldRenderComponent(featureFlagsValue, 'feature2', onComponent);
      expect(renderedComponent).toEqual(React.createElement(React.Fragment));
    });
  });

  describe('flagIsOffShouldRenderComponent', () => {
    it('should render the component if the feature flag is OFF', () => {
      const offComponent = React.createElement('<div>Rendered on OFF</div>');
      const renderedComponent = flagIsOffShouldRenderComponent(featureFlagsValue, 'feature2', offComponent);
      expect(renderedComponent).toEqual(offComponent);
    });

    it('should render an empty fragment if the feature flag is not OFF', () => {
      const offComponent = React.createElement('<div>Rendered on OFF</div>');
      const renderedComponent = flagIsOffShouldRenderComponent(featureFlagsValue, 'feature1', offComponent);
      expect(renderedComponent).toEqual(React.createElement(React.Fragment));
    });

    it('should render the component if the feature flag is undefined', () => {
      const offComponent = React.createElement('<div>Rendered on OFF</div>');
      const renderedComponent = flagIsOffShouldRenderComponent(featureFlagsValue, 'undefinedFeature', offComponent);
      expect(renderedComponent).toEqual(offComponent);
    });
  });

  describe('flagEqualsValueShouldRenderComponent', () => {
    it('should render the component if the feature flag value equals the specified value', () => {
      const renderComponent = React.createElement('<div>Rendered on value1</div>');
      const renderedComponent = flagEqualsValueShouldRenderComponent(
        featureFlagsValue,
        'feature1',
        'value1',
        renderComponent,
      );
      expect(renderedComponent).toEqual(renderComponent);
    });

    it('should render an empty fragment if the feature flag value does not equal the specified value', () => {
      const renderComponent = React.createElement('<div>Rendered on value1</div>');
      const renderedComponent = flagEqualsValueShouldRenderComponent(
        featureFlagsValue,
        'feature2',
        'value1',
        renderComponent,
      );
      expect(renderedComponent).toEqual(React.createElement(React.Fragment));
    });

    it('should render an empty fragment if the feature flag is undefined', () => {
      const renderComponent = React.createElement('<div>Rendered on value1</div>');
      const renderedComponent = flagEqualsValueShouldRenderComponent(
        featureFlagsValue,
        'undefinedFeature',
        'value1',
        renderComponent,
      );
      expect(renderedComponent).toEqual(React.createElement(React.Fragment));
    });
  });

  describe('flagIsOnShouldCallback', () => {
    it('should execute the callback if the feature flag is ON', () => {
      const onCallback = jest.fn();
      flagIsOnShouldCallback(featureFlagsValue, 'feature1', onCallback);
      expect(onCallback).toHaveBeenCalled();
    });

    it('should not execute the callback if the feature flag is not ON', () => {
      const onCallback = jest.fn();
      flagIsOnShouldCallback(featureFlagsValue, 'feature2', onCallback);
      expect(onCallback).not.toHaveBeenCalled();
    });

    it('should not execute the callback if the feature flag is undefined', () => {
      const onCallback = jest.fn();
      flagIsOnShouldCallback(featureFlagsValue, 'undefinedFeature', onCallback);
      expect(onCallback).not.toHaveBeenCalled();
    });
  });

  describe('flagIsOffShouldCallback', () => {
    it('should execute the callback if the feature flag is OFF', () => {
      const offCallback = jest.fn();
      flagIsOffShouldCallback(featureFlagsValue, 'feature2', offCallback);
      expect(offCallback).toHaveBeenCalled();
    });

    it('should not execute the callback if the feature flag is not OFF', () => {
      const offCallback = jest.fn();
      flagIsOffShouldCallback(featureFlagsValue, 'feature1', offCallback);
      expect(offCallback).not.toHaveBeenCalled();
    });

    it('should execute the callback if the feature flag is undefined', () => {
      const offCallback = jest.fn();
      flagIsOffShouldCallback(featureFlagsValue, 'undefinedFeature', offCallback);
      expect(offCallback).toHaveBeenCalled();
    });
  });

  describe('flagEqualsValueShouldCallback', () => {
    it('should execute the callback if the feature flag value equals the specified value', () => {
      const equalsCallback = jest.fn();
      flagEqualsValueShouldCallback(featureFlagsValue, 'feature1', 'value1', equalsCallback);
      expect(equalsCallback).toHaveBeenCalled();
    });

    it('should not execute the callback if the feature flag value does not equal the specified value', () => {
      const equalsCallback = jest.fn();
      flagEqualsValueShouldCallback(featureFlagsValue, 'feature2', 'value1', equalsCallback);
      expect(equalsCallback).not.toHaveBeenCalled();
    });

    it('should not execute the callback if the feature flag is undefined', () => {
      const equalsCallback = jest.fn();
      flagEqualsValueShouldCallback(featureFlagsValue, 'undefinedFeature', 'value1', equalsCallback);
      expect(equalsCallback).not.toHaveBeenCalled();
    });
  });
});
