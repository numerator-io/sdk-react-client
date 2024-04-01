import { deepCopy, mapArrayToRecord, sleep, withTimeout, areObjectsEqual } from '../../main/util';

describe('Utility Functions', () => {
  describe('deepCopy', () => {
    it('should create a deep copy of the object', () => {
      const original = { key: 'value', nested: { nestedKey: 'nestedValue' } };
      const copied = deepCopy(original);

      // Check that the copied object is deeply equal to the original
      expect(copied).toEqual(original);
      // Check that the copied object is not the same reference as the original
      expect(copied).not.toBe(original);
    });
  });

  describe('sleep', () => {
    it('should sleep for the specified duration', async () => {
      const startTime = Date.now();
      const duration = 100; // milliseconds

      await sleep(duration);

      const endTime = Date.now();
      const elapsedTime = endTime - startTime;

      // Check that the elapsed time is greater than or equal to the specified duration
      expect(elapsedTime).toBeGreaterThanOrEqual(duration);
    });
  });

  describe('mapArrayToRecord', () => {
    it('should map an array of objects to a Record using the "key" property', () => {
      const array = [
        { key: 'a', value: 1 },
        { key: 'b', value: 2 },
      ];
      const record = mapArrayToRecord(array);

      // Check that the keys in the record match the "key" property of each object
      expect(Object.keys(record)).toEqual(['a', 'b']);
      // Check that the values in the record match the original objects
      expect(record['a']).toEqual(array[0]);
      expect(record['b']).toEqual(array[1]);
    });
  });

  describe('withTimeout', () => {
    it('should resolve with the original promise result', async () => {
      const originalPromise = Promise.resolve('result');
      const result = await withTimeout(originalPromise, 100);

      // Check that the result matches the resolved value of the original promise
      expect(result).toBe('result');
    });

    it('should reject with a timeout error if the original promise takes too long', async () => {
      const originalPromise = new Promise((resolve) => setTimeout(() => resolve('result'), 200));
      await expect(withTimeout(originalPromise, 100)).rejects.toThrow('Operation timed out');
    });
  });
});

describe('areObjectsEqual', () => {
  it('should return true for equal objects', () => {
      const obj1: Record<string, any> = { name: 'John', age: 30, hobbies: ['reading', 'painting'] };
      const obj2: Record<string, any> = { name: 'John', age: 30, hobbies: ['reading', 'painting'] };
      expect(areObjectsEqual(obj1, obj2)).toBe(true);
  });

  it('should return false for unequal objects', () => {
      const obj1: Record<string, any> = { name: 'John', age: 30, hobbies: ['reading', 'painting'] };
      const obj3: Record<string, any> = { name: 'Jane', age: 25, hobbies: ['coding', 'gaming'] };
      expect(areObjectsEqual(obj1, obj3)).toBe(false);
  });
});
