// Get all feature flags associated with the project
export const END_POINT_FEATURE_FLAGS = 'api/sdk/feature-flags';

// Get the details of a feature flag by key
export const END_POINT_FEATURE_FLAG_DETAIL_BY_KEY = `${END_POINT_FEATURE_FLAGS}/by-key`;

// Get the details of a feature flag by id
export const END_POINT_FEATURE_FLAG_DETAIL_BY_ID = `${END_POINT_FEATURE_FLAGS}/by-id`;

// Get the state of the feature flag by key
export const END_POINT_FEATURE_FLAG_STATE_BY_KEY = `${END_POINT_FEATURE_FLAGS}/state-by-key`;

// Get the state of the feature flag by id
export const END_POINT_FEATURE_FLAG_STATE_BY_ID = `${END_POINT_FEATURE_FLAGS}/state-by-id`;
