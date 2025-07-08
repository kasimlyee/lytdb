import { DatabaseState, StorageAdapter, StorageOptions } from "../types";

export class BrowserStorage implements StorageAdapter {
  private readonly storageKey: string;

  constructor(options: StorageOptions = {}) {
    this.storageKey = options.storageKey || "lytdb";
  }

  async save(state: DatabaseState): Promise<void> {
    if (typeof window === "undefined" || !window.localStorage) {
      throw new Error("LocalStorage is not available in this environment");
    }

    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(this.storageKey, serialized);
    } catch (error) {
      throw new Error(
        `Failed to save to localStorage: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async load(): Promise<DatabaseState | null> {
    if (typeof window === "undefined" || !window.localStorage) {
      throw new Error("LocalStorage is not available in this environment");
    }

    try {
      const serialized = localStorage.getItem(this.storageKey);
      return serialized ? JSON.parse(serialized) : null;
    } catch (error) {
      throw new Error(
        `Failed to load from localStorage: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async clear(): Promise<void> {
    if (typeof window === "undefined" || !window.localStorage) {
      throw new Error("LocalStorage is not available in this environment");
    }

    localStorage.removeItem(this.storageKey);
  }
}
