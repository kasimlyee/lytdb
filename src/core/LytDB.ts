import { Base64Exporter } from "../export/exporter";
import {
  DatabaseState,
  Exporter,
  StorageAdapter,
  TableName,
  TableSchema,
} from "../types";

export class LytDB {
  private state: DatabaseState = {
    tables: {},
    schemas: {},
  };

  private storageAdapter?: StorageAdapter;
  private exporter: Exporter = new Base64Exporter();

  constructor(private options: { persist?: boolean } = {}) {}

  async initPersistence(storage: StorageAdapter): Promise<void> {
    this.storageAdapter = storage;
    if (this.options.persist) {
      const savedState = await storage.load();
      if (savedState) {
        this.state = savedState;
      }
    }
  }

  async save(): Promise<void> {
    if (this.storageAdapter) {
      await this.storageAdapter.save(this.state);
    }
  }

  async clearStorage(): Promise<void> {
    if (this.storageAdapter) {
      await this.storageAdapter.clear();
    }
  }

  createTable<T>(schema: TableSchema<T>): void {
    if (this.state.schemas[schema.name]) {
      throw new Error(`Table ${schema.name} already exists`);
    }

    this.state.schemas[schema.name] = schema;
    this.state.tables[schema.name] = [];
  }

  listTables(): TableName[] {
    return Object.keys(this.state.tables);
  }

  insert<T>(table: TableName, item: T): T {
    if (!this.state.tables[table]) {
      throw new Error(`Table ${table} does not exist`);
    }

    //Create a shallow copy to prevent external modifications
    const itemToInsert = { ...item };
    this.state.tables[table].push(itemToInsert);
    return itemToInsert;
  }

  findOne<T>(table: TableName, predicate: (item: T) => boolean): T | null {
    const items = this.getAllItems<T>(table);
    return items.find(predicate) || null;
  }

  findAll<T>(table: TableName, predicate?: (item: T) => boolean): T[] {
    const items = this.getAllItems<T>(table);
    return predicate ? items.filter(predicate) : [...items];
  }

  update<T>(
    table: TableName,
    predicate: (item: T) => boolean,
    update: Partial<T>
  ): number {
    const items = this.getAllItems<T>(table);
    let updateCount = 0;

    for (let i = 0; i < items.length; i++) {
      if (predicate(items[i])) {
        items[i] = { ...items[i], ...update };
        updateCount++;
      }
    }
    return updateCount;
  }

  delete<T>(table: TableName, predicate: (item: T) => boolean): number {
    if (!this.state.tables[table]) {
      throw new Error(`Table ${table} does not exist`);
    }

    const originalLength = this.state.tables[table].length;
    this.state.tables[table] = this.state.tables[table].filter(
      (item) => !predicate(item as T)
    );
    return originalLength - this.state.tables[table].length;
  }

  private getAllItems<T>(table: TableName): T[] {
    if (!this.state.tables[table]) {
      throw new Error(`Table ${table} does no exist`);
    }
    return this.state.tables[table] as T[];
  }

  async exportToBlob(): Promise<string> {
    return this.exporter.exportToBlob(this.state);
  }

  async importFromBlob(
    blob: string,
    options: { merge?: boolean } = {}
  ): Promise<void> {
    const importedState = await this.exporter.importFromBlob(blob);

    if (options.merge) {
      for (const [tableName, items] of Object.entries(importedState.tables)) {
        if (this.state.tables[tableName]) {
          this.state.tables[tableName].push(...items);
        } else {
          this.state.tables[tableName] = [...items];
        }
      }
    }
    this.state = importedState;
  }
}
