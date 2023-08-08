declare module 'fs/promises' {
  // @see https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V20.md#20.4.0
  interface FileHandle extends AsyncDisposable {
    [Symbol.asyncDispose](): Promise<void>;
  }
}

declare module 'child_process' {
  interface ChildProcess extends Disposable {
    [Symbol.dispose](): () => void;
  }
}

declare module 'stream' {
  interface Readable extends AsyncDisposable {
    [Symbol.asyncDispose](): () => void;
  }
}

export {};
