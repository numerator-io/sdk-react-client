import { FeatureFlag, FeatureFlagState } from '../client/type.client';

export interface NumeratorContextType {
  featureFlagsConfig: Record<string, FeatureFlag>;
  featureFlagsState: Record<string, FeatureFlagState<any>>;
  fetchFeatureFlagsConfig: () => void;
  fetchFeatureFlagsConfigBy: ({ key, id }: { key?: string; id?: string }) => void;
  fetchFeatureFlagState: ({ context, key, id }: { context?: Record<string, any>; key?: string; id?: string }) => void;
}
