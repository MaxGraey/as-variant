const enum Discriminator {
  Bool,
   I8, I16, I32, I64,
   U8, U16, U32, U64,
  F32, F64,
  UnmanagedRef,
  ManagedRef
}

// @ts-ignore: decorator
@inline
function DISCRIMINATOR<T>(): Discriminator {
  if (isManaged<T>())   return Discriminator.ManagedRef + idof<T>();
  if (isReference<T>()) return Discriminator.UnmanagedRef;
  const value: T = 0;
  if (value instanceof bool) return Discriminator.Bool;
  if (value instanceof i8)   return Discriminator.I8;
  if (value instanceof i16)  return Discriminator.I16;
  if (value instanceof i32)  return Discriminator.I32;
  if (value instanceof i64)  return Discriminator.I64;
  if (value instanceof u8)   return Discriminator.U8;
  if (value instanceof u16)  return Discriminator.U16;
  if (value instanceof u32)  return Discriminator.U32;
  if (value instanceof u64)  return Discriminator.U64;
  if (value instanceof f32)  return Discriminator.F32;
  if (value instanceof f64)  return Discriminator.F64;
  return unreachable();
}

// @ts-ignore: decorator
@inline
const STORAGE = offsetof<Variant>("storage");

@final
export class Variant {

  @inline static from<T>(value: T): Variant {
    var out = changetype<Variant>(__new(offsetof<Variant>(), idof<Variant>()));
    out.set<T>(value);
    return out;
  }

  @inline static idof<T>(): i32 {
    return DISCRIMINATOR<T>();
  }

  private discriminator: i32;
  private storage: u64;

  private constructor() { unreachable(); }

  @inline get id(): i32 {
    return this.discriminator;
  }

  @inline set<T>(value: T): void {
    this.discriminator = DISCRIMINATOR<T>();
    store<T>(changetype<usize>(this), value, STORAGE);
  }

  @inline get<T>(): T {
    if (!this.is<T>()) throw new Error("type mismatch");
    let value = this.getUnchecked<T>();
    if (isReference<T>() && !isNullable<T>()) {
      if (!value) throw new Error("unexpected null");
    }
    return value;
  }

  @unsafe @inline getUnchecked<T>(): T {
    return load<T>(changetype<usize>(this), STORAGE);
  }

  @inline is<T>(): bool {
    return this.discriminator == DISCRIMINATOR<T>();
  }

  @unsafe private __visit(cookie: u32): void {
    if (this.discriminator >= Discriminator.ManagedRef) {
      let ptr = this.getUnchecked<usize>();
      if (ptr) __visit(ptr, cookie);
    }
  }
}
