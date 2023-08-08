declare module 'node:stream' {
  interface Readable {
    [Symbol.asyncDispose](): PromiseLike<void>;
  }

  interface Transform {
    [Symbol.asyncDispose](): PromiseLike<void>;
  }
}

export {};