export type Unpacked<T> = T extends Array<infer U> ? U : T extends Promise<infer U> ? U : T
