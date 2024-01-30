import { ReactNode } from 'react';
import { FeatureFlagConfig, FeatureFlagValue } from '../client/type.client';

export interface NumeratorContextType {
  featureFlagsConfig: Record<string, FeatureFlagConfig>;
  featureFlagsValue: Record<string, FeatureFlagValue<any>>;
  fetchAllFeatureFlagsConfig: () => void;
  fetchFeatureFlagConfig: ({ key }: { key: string }) => void;
  fetchFeatureFlagValue: ({ key, context }: { key: string; context?: Record<string, any> }) => void;
}

export interface NumeratorProviderProps {
  children: ReactNode;
  loadConfigListingOnMount?: boolean;
}
