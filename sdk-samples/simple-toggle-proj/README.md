# React Client SDK Sample: Pet Game

## Overview

Welcome to the React client SDK sample Pet game project. This project serves as a demonstration of integrating the Numerator Provider into a simple Pet game application. By exploring this project, you can learn how to create a custom provider that leverages methods from the Numerator Provider. Additionally, you'll discover how to retrieve feature flags both with and without polling enabled.

## Getting Started

To run this sample, simply execute `yarn start` in your terminal.

## Key Features

- **Custom Provider Integration**: Explore the `IntegratedNumeratorProvider` to understand how methods from the Numerator Provider are utilized within the custom provider. This provider offers `checkEnabledFeatureFlag` and `checkAsyncEnabledFeatureFlag` functions for retrieving flag values when polling is enabled or disabled, respectively.

- **NumeratorProvider Usage**: Alternatively, you can directly use methods provided by `NumeratorProvider` to suit your specific requirements.

- **Testing with Jest**: If you're interested in unit testing with Jest and want to learn how to mock flags and create unit tests for your components, you can find an example in the [App.test.tsx](./src/App.test.tsx) file.

## How to Explore

1. Begin by examining the implementation of the `IntegratedNumeratorProvider`. This component demonstrates how to effectively integrate the Numerator Provider's functionality into your application.

2. Experiment with the provided features to understand how feature flags are retrieved based on the polling state.

3. Feel free to explore other components and functionalities of the Pet game to gain further insights into React client SDK development.
