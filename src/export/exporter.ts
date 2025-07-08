import { DatabaseState, Exporter } from "../types";

export class Base64Exporter implements Exporter {
  async exportToBlob(state: DatabaseState): Promise<string> {
    try {
      const json = JSON.stringify(state);
      if (typeof btoa !== "undefined") {
        //Browser environment
        return btoa(unescape(encodeURIComponent(json)));
      } else {
        //Node.js environment
        return Buffer.from(json).toString("base64");
      }
    } catch (error) {
      throw new Error(
        `Export failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async importFromBlob(blob: string): Promise<DatabaseState> {
    try {
      let json: string;
      if (typeof atob !== "undefined") {
        //Bowser environment
        json = decodeURIComponent(escape(atob(blob)));
      } else {
        //node.js environment
        json = Buffer.from(blob, "base64").toString("utf-8");
      }
      return JSON.parse(json) as DatabaseState;
    } catch (error) {
      throw new Error(
        `Import failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
