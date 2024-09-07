// BASIC TRANSFORMATIONS
export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export type ValueType<T> = T extends Record<string, infer R> ? R : never;
export type Union<T> = T[keyof T];
export type Constructor<T = {}> = new (...args: any[]) => T;

type Extends<T, U> = T extends U ? T : never;

// BRANDING
declare const _BrandSymbol: unique symbol;
export type Brand<T, TBrand> = T & { readonly [_BrandSymbol]: TBrand };

// TUPLE & ARRAY
type IsTuple<T> =
	T extends readonly any[] ?
		number extends T['length'] ?
			never
		:	T
	:	never;

export type TupleToUnion<T> = T extends IsTuple<T> ? T[number] : never;

// INTERSECTION
export type IntersectWithBase<R, T> = {
	[K in keyof T]: R & T[K];
};

// NUMERIC RANGE
type Enumerate<N extends number, Acc extends number[] = []> =
	Acc['length'] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

// STRING MANIPULATION
export type StringLiteralPrimitive = string | number | bigint | boolean;
export type ExtractPrefix<
	T,
	TSeparator extends StringLiteralPrimitive = '_',
	TExpectedType extends string = string,
> = Extends<T extends `${infer P}${TSeparator}${string}` ? P : never, TExpectedType>;

export type ExtractSuffix<
	T,
	TSeparator extends StringLiteralPrimitive = '_',
	TExpectedType extends string = string,
> = Extends<T extends `${string}${TSeparator}${infer S}` ? S : never, TExpectedType>;

