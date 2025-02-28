import { hash, compare } from '../../lib/encrypt';

describe('encrypt', () => {
  describe('hash', () => {
    it('should hash a string', async () => {
      const result = await hash('password123');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return the same hash for the same input', async () => {
      const hash1 = await hash('password123');
      const hash2 = await hash('password123');
      expect(hash1).toBe(hash2);
    });

    it('should return different hashes for different inputs', async () => {
      const hash1 = await hash('password123');
      const hash2 = await hash('password456');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compare', () => {
    it('should return true for matching passwords', async () => {
      const hashedPassword = await hash('password123');
      const result = await compare('password123', hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const hashedPassword = await hash('password123');
      const result = await compare('wrongpassword', hashedPassword);
      expect(result).toBe(false);
    });
  });
});
