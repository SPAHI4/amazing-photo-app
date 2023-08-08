import fs, { FileHandle } from 'node:fs/promises';
import path from 'node:path';
import * as os from 'node:os';

const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

/**
 * Creates a temporary file that will be deleted when the class instance is disposed.
 */
export class TempFile implements AsyncDisposable {
  #fileHandle: FileHandle;

  #filePath: string;

  constructor(fileHandle: FileHandle, filePath: string) {
    this.#fileHandle = fileHandle;
    this.#filePath = filePath;
  }

  static async createRead(filePath?: string): Promise<TempFile> {
    const tmpPath = filePath ?? path.resolve(os.tmpdir(), Math.random().toString(36).slice(2));
    const fileHandle = await fs.open(tmpPath, 'r+');

    return new TempFile(fileHandle, tmpPath);
  }

  static async createWrite(filePath?: string): Promise<TempFile> {
    const tmpPath = filePath ?? path.resolve(os.tmpdir(), Math.random().toString(36).slice(2));
    const fileHandle = await fs.open(tmpPath, 'w+');

    return new TempFile(fileHandle, tmpPath);
  }

  get handle(): FileHandle {
    return this.#fileHandle;
  }

  get path(): string {
    return this.#filePath;
  }

  async [Symbol.asyncDispose](): Promise<void> {
    await this.#fileHandle.close();

    if (await fileExists(this.#filePath)) {
      await fs.unlink(this.#filePath);
    }
  }
}
