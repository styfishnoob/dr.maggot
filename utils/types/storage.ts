type PrimitiveType = string | number | boolean;
type ObjectType = { [K in string]: CompositeType };
type ArrayType = CompositeType[];

export type CompositeType = PrimitiveType | ObjectType | ArrayType;
export type KeyValue = { [K in string]: CompositeType };
export type Maps = { [K in string]: [string, CompositeType][] };
