import { describe, it, expect } from 'vitest';
import { convertToPlanObject, formatNumberWithDecimals } from '../../lib/utils';

describe('convertToPlanObject', () => {
  it('should convert an object to a plan object and back', () => {
    const input = { name: 'Test', value: 42 };
    const result = convertToPlanObject(input);

    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });

  it('should handle arrays', () => {
    const input = [1, 2, 3];
    const result = convertToPlanObject(input);

    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });

  it('should handle nested objects', () => {
    const input = { user: { name: 'Alice', age: 30 } };
    const result = convertToPlanObject(input);

    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });
});

describe('formatNumberWithDecimals', () => {
  it('should format a number with two decimal places', () => {
    const result = formatNumberWithDecimals(123.45);
    expect(result).toBe('123.45');
  });

  it('should format a number with no decimal places', () => {
    const result = formatNumberWithDecimals(123);
    expect(result).toBe('123.00');
  });
});
