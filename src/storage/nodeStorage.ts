import { promises as fs } from "fs";
import path from "path";
import { DatabaseState, StorageAdapter, StorageOptions } from "../types";

export class NodeStorage implements StorageAdapter {
  private readonly filepath: string;

  constructor(options: StorageOptions & { filepath?: string } = {}) {
    this.filepath =
      options.filepath || options.storageKey
        ? `${options.storageKey || "lytdb"}.json`
        : "lytdb.json";
  }

  async save(state: DatabaseState): Promise<void> {
    try {
      const serialized = JSON.stringify(state, null, 2);
      await fs.writeFile(this.filepath, serialized, "utf-8");
    } catch (error) {
      throw new Error(
        `Failed to save to file: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async load(): Promise<DatabaseState | null> {
    try {
      await fs.access(this.filepath);
      const content = await fs.readFile(this.filepath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        const dir = path.dirname(this.filepath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(this.filepath, "{}", "utf-8");
        return { tables: {}, schemas: {} }; // File didn't exist, return empty state
      }
      throw new Error(
        `Failed to load from file: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async clear(): Promise<void> {
    try {
      await fs.unlink(this.filepath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw new Error(
          `Failed to clear storage: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  }
}
