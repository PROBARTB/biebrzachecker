export type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export class SimpleCache {
  private store = new Map<string, CacheEntry<any>>();
  private cleanupInterval: NodeJS.Timeout;

  constructor(private ttlMs: number, cleanupEveryMs = 2*60_000) {
    this.cleanupInterval = setInterval(() => this.cleanup(), cleanupEveryMs);
  }

  set<T>(key: string, value: T) {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  delete(key: string) {
    this.store.delete(key);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt < now) {
        this.store.delete(key);
      }
    }
  }

  stop() {
    clearInterval(this.cleanupInterval);
  }
}
