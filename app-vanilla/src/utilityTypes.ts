export type ValueType<T> = T extends Record<string, infer R> ? R : never;
export type Brand<K, T> = K & { __brand: T };
