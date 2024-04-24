const END_POINT_BASE = 'api/v1/sdk/feature-flag';

// Get all feature flags config associated with the project
export const END_POINT_FEATURE_FLAG_CONFIG_LISTING = `${END_POINT_BASE}/listing`;

// Get the config of a feature flag by key
export const END_POINT_FEATURE_FLAG_CONFIG_BY_KEY = `${END_POINT_BASE}/detail-by-key`;

// Get the value of the feature flag by key
export const END_POINT_FEATURE_FLAG_VALUE_BY_KEY = `${END_POINT_BASE}/by-key`;

// Get the value of flag collection by context
export const END_POINT_FEATURE_FLAG_COLLECTION_POLLING = `${END_POINT_BASE}/polling`;
