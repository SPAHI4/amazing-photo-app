// @see https://github.com/tc39/proposal-explicit-resource-management
declare global {
  interface SymbolConstructor {
    readonly asyncDispose: symbol;
    readonly dispose: symbol;
  }

  interface Disposable {
    [Symbol.dispose](): void;
  }

  interface AsyncDisposable {
    [Symbol.asyncDispose](): PromiseLike<void>;
  }
}

export {};
