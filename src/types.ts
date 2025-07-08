/**
 * Core types for LyteDB database engine
 */

export type TableName = string;

export interface TableSchema<T> {
  name: TableName;
  //Will be extended with schema validation in future phases
}

export interface DatabaseState {
  tables: Record<TableName, unknown[]>;
  schemas: Record<TableName, TableSchema<unknown>>;
}

export interface StorageAdapter {
  save(state: DatabaseState): Promise<void>;
  load(): Promise<DatabaseState | null>;
  clear(): Promise<void>;
}

export type StorageOptions = {
  /**key/name to use for storage {default: 'lytdb'} */
  storageKey?: string;
};

export interface Exporter {
  exportToBlob(state: DatabaseState): Promise<string>;
  importFromBlob(blob: Blob | string): Promise<DatabaseState>;
}
