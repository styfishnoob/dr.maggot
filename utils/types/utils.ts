export type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];
export type Brand<K, T> = K & { __brand: T };
