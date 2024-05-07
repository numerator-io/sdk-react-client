import type { Config } from "jest";

// Define the configuration function with a name
const jestConfig = async (): Promise<Config> => {
  return {
    verbose: true,
    transform: {
      "\\.[jt]sx?$": "ts-jest",
    },
    testEnvironment: "jsdom",
  };
};

// Export the named function as default
export default jestConfig;
