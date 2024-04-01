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
/**
 * Convert snakecase object to camelcase object.
 * @param obj - The original object.
 * @returns A Promise that return camel object.
 */
export const snakeToCamel = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  }

  return Object.keys(obj).reduce((acc: any, key: string) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = snakeToCamel(obj[key]);
    return acc;
  }, {});
};

/**
 * Add records to another records
 * @param firstObject - The first records object.
 * @param secondObject  _ the second records object.
 */
export const areObjectsEqual = (firstObject: Record<string, any>, secondObject: Record<string, any>): boolean => {
  // Check if the number of keys are equal
  const keys1 = Object.keys(firstObject);
  const keys2 = Object.keys(secondObject);
  if (keys1.length !== keys2.length) {
      return false;
  }

  // Check if each key-value pair matches
  for (const key of keys1) {
      // Check if the key exists in both objects
      if (!(key in secondObject)) {
          return false;
      }

      // Check if the values are equal
      const value1 = firstObject[key];
      const value2 = secondObject[key];
      if (value1 !== value2) {
          // If the values are objects, recursively check them
          if (typeof value1 === 'object' && typeof value2 === 'object') {
              if (!areObjectsEqual(value1, value2)) {
                  return false;
              }
          } else {
              return false;
          }
      }
  }

  return true;
}
