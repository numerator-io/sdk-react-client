// Deep copy an object using JSON
export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

// Async sleep function using Promises
export const sleep = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

// Map an array of objects to a Record using a specific key
export const mapArrayToRecord = <T extends { key: string }>(array: T[]): Record<string, T> => {
  return Object.fromEntries(array.map((item) => [item.key, item]));
};

// Function to create a promise with a timeout
export const withTimeout = <T>(promise: Promise<T>, timeout: number): Promise<T> => {
  const timeoutPromise = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error('Operation timed out')), timeout),
  );
  return Promise.race([promise, timeoutPromise]);
};
