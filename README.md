# Numerator Client-side SDK for React

## Numerator overview

Welcome to the official documentation site for Numerator, your go-to platform for feature flag management. Whether you're a developer integrating Numerator into your application or an administrator managing feature flags, this documentation will guide you through the process.

If you have any questions, need support, or want to provide feedback, please contact us at [support@numerator.io](mailto:support@numerator.io).

## Supported React versions

Our Numerator SDK for React supports the following versions:

- React 16.x and above

## Getting started

- 📖 **Introduction**: Gain a foundational understanding of feature flags, their significance in modern software development, and how Numerator empowers you with dynamic control over your application's features. [Go to Introduction](#)
- ⚙️ **Installation**: Learn the straightforward process of installing Numerator SDKs and integrating them seamlessly into your development environment, paving the way for effective feature flag management. [Go to Installation](#)
- 🖥️ **Creating an Account and Onboarding Your Organization**: Explore the steps to create a Numerator account and seamlessly onboard your organization. Set the stage for a smooth transition into feature flag implementation and management. [Go to Creating an Account and Onboarding Your Organization](#)

Continue your exploration by navigating through the child pages for detailed insights and step-by-step instructions.

## Learn more

Explore our comprehensive documentation to discover advanced features, best practices, and tips for maximizing the benefits of Numerator in your projects.

## Testing

Ensure the reliability and effectiveness of your feature flag implementation with thorough testing strategies and techniques.

For unit testing with Numerator, we provide five key methods: `mockFlags`, `addMockedFlag`, `removeMockedFlag`, `useMockNumeratorProvider`, `resetNumeratorMocks`.

### Resetting Mocked Flags

Before each test, it's essential to clear any existing mocked flags. Use the `resetNumeratorMocks` method to reset the state:

```javascript
beforeEach(() => {
  resetNumeratorMocks();
});
```

### Mocking Flags

To simulate feature flags, utilize the `mockFlags` method. For example:

```javascript
const mockFlag1 = {
  key: 'dev-test-flag',
  value: 'one',
  context: { env: 'dev' },
};
const mockFlag2 = {
  key: 'dev-test-flag',
  value: 'two',
  context: { env: 'prod' },
};

// Pass an array of flags to mock multiple flags at once
mockFlags([mockFlag1, mockFlag2]);
```

### Managing Mocked Flags

Use `addMockedFlag` to introduce a new flag or `removeMockedFlag` to delete an existing flag from the mocked set, allowing you to dynamically adjust the test environment as needed.

### Using Mock Numerator Provider

Utilize `useMockNumeratorProvider` as a substitute for `useNumeratorContext` to access all the usual functionalities of `NumeratorProvider` in a mocked and adapted form suitable for unit testing.

```javascript
// Mocking NumeratorProvider
const { getFeatureFlag } = useMockNumeratorProvider({ defaultContext: { env: 'dev' } });

// Calling getFeatureFlag to get the requested flag value
let devTestFlagValue = await getFeatureFlag('dev-test-flag', 'default');

// Assertion
expect(devTestFlagValue).toEqual('one');

devTestFlagValue = await getFeatureFlag('dev-test-flag', 'default', { env: 'prod' });

// Assertion
expect(devTestFlagValue).toEqual('two');
```

## Contributing

We welcome contributions from the community to enhance Numerator's capabilities, fix bugs, and improve documentation. Check out our contribution guidelines to learn how you can contribute.

## About Numerator

Numerator is a powerful feature flag management platform designed to streamline the process of feature rollout and experimentation. With Numerator, teams can efficiently manage feature lifecycles, control feature releases, and gather valuable insights through experimentation and A/B testing.
