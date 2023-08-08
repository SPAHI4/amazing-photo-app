declare module 'postgres-bytea' {
  function byteaFunction(value: string): Buffer;
  export = byteaFunction;
}