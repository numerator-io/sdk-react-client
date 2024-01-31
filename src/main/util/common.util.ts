/**
 * Deep copy an object using JSON.
 * @param obj - The object to be deep copied.
 * @returns A deep copy of the input object.
 */
export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

/**
 * Asynchronous sleep function using Promises.
 * @param milliseconds - The duration to sleep in milliseconds.
 * @returns A Promise that resolves after the specified duration.
 */
export const sleep = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

/**
 * Map an array of objects to a Record using a specific key.
 * @param array - The array of objects to be mapped.
 * @returns A Record where keys are extracted from the 'key' property of each object.
 */
export const mapArrayToRecord = <T extends { key: string }>(array: T[]): Record<string, T> => {
  return Object.fromEntries(array.map((item) => [item.key, item]));
};

/**
 * Create a promise with a timeout.
 * @param promise - The original promise to be wrapped with a timeout.
 * @param timeout - The timeout duration in milliseconds.
 * @returns A Promise that resolves when the original promise resolves or rejects with a timeout error.
 */
export const withTimeout = <T>(promise: Promise<T>, timeout: number): Promise<T> => {
  const timeoutPromise = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error('Operation timed out')), timeout),
  );
  return Promise.race([promise, timeoutPromise]);
};
