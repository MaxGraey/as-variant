
export enum VariantTy {
  Bool,
   I8, I16, I32, I64,
   U8, U16, U32, U64,
  F32, F64,
  UnmanagedRef,
  ManagedRef
}

@final
export class Variant {
  @inline static from<T>(value: T): Variant {
    let ty!: VariantTy;
         if (value instanceof bool) ty = VariantTy.Bool;
    else if (value instanceof i8)   ty = VariantTy.I8;
    else if (value instanceof i16)  ty = VariantTy.I16;
    else if (value instanceof i32)  ty = VariantTy.I32;
    else if (value instanceof i64)  ty = VariantTy.I64;
    else if (value instanceof u8)   ty = VariantTy.U8;
    else if (value instanceof u16)  ty = VariantTy.U16;
    else if (value instanceof u32)  ty = VariantTy.U32;
    else if (value instanceof u64)  ty = VariantTy.U64;
    // @ts-ignore
    else if (value instanceof f32)  return new Variant(reinterpret<u32>(value), VariantTy.F32);
    // @ts-ignore
    else if (value instanceof f64)  return new Variant(reinterpret<u64>(value), VariantTy.F64);

    if (isReference<T>()) {
      if (isManaged<T>()) {
        return new Variant(changetype<usize>(value), VariantTy.ManagedRef + idof<T>());
      } else {
        return new Variant(changetype<usize>(value), VariantTy.UnmanagedRef);
      }
    } else {
      // @ts-ignore
      return new Variant(<u64>value, ty);
    }
  }

  protected constructor(
    private value: u64,
    private discriminator: i32
  ) {}

  @inline set<T>(value: T): void {
    let ty!: VariantTy;
         if (value instanceof bool) ty = VariantTy.Bool;
    else if (value instanceof i8)   ty = VariantTy.I8;
    else if (value instanceof i16)  ty = VariantTy.I16;
    else if (value instanceof i32)  ty = VariantTy.I32;
    else if (value instanceof i64)  ty = VariantTy.I64;
    else if (value instanceof u8)   ty = VariantTy.U8;
    else if (value instanceof u16)  ty = VariantTy.U16;
    else if (value instanceof u32)  ty = VariantTy.U32;
    else if (value instanceof u64)  ty = VariantTy.U64;
    else if (value instanceof f32) {
      // @ts-ignore
      this.value = <u64>reinterpret<u32>(value);
      this.discriminator = VariantTy.F32;
      return;
    } else if (value instanceof f64) {
      // @ts-ignore
      this.value = reinterpret<u64>(value);
      this.discriminator = VariantTy.F64;
      return;
    }

    if (isReference<T>()) {
      this.value = changetype<usize>(value);
      if (isManaged<T>()) {
        this.discriminator = VariantTy.ManagedRef + idof<T>();
      } else {
        this.discriminator = VariantTy.UnmanagedRef;
      }
    } else {
      // @ts-ignore
      this.value = <u64>value;
      this.discriminator = ty;
    }
  }

  @inline get<T>(): T {
    if (!this.is<T>()) throw new Error("type mismatch");
    return this.uncheckedGet<T>();
  }

  @inline uncheckedGet<T>(): T {
    let value!: T, val = this.value;
    if (value instanceof f32) {
      // @ts-ignore
      return reinterpret<f32>(<u32>val);
    } else if (value instanceof f64) {
      // @ts-ignore
      return reinterpret<f64>(val);
    } else if (isReference<T>()) {
      if (!isNullable<T>() && !val) {
        throw new Error("unexpected null");
      }
      return changetype<T>(<usize>val);
    } else {
      // @ts-ignore
      return <T>val;
    }
  }

  @inline is<T>(): bool {
    let
      value!: T,
      ty = this.discriminator;

         if (value instanceof bool) return ty == VariantTy.Bool;
    else if (value instanceof i8)   return ty == VariantTy.I8;
    else if (value instanceof i16)  return ty == VariantTy.I16;
    else if (value instanceof i32)  return ty == VariantTy.I32;
    else if (value instanceof i64)  return ty == VariantTy.I64;
    else if (value instanceof u8)   return ty == VariantTy.U8;
    else if (value instanceof u16)  return ty == VariantTy.U16;
    else if (value instanceof u32)  return ty == VariantTy.U32;
    else if (value instanceof u64)  return ty == VariantTy.U64;
    else if (value instanceof f32)  return ty == VariantTy.F32;
    else if (value instanceof f64)  return ty == VariantTy.F64;
    else                            return ty == VariantTy.ManagedRef + idof<T>();
  }

  @unsafe private __visit(cookie: u32): void {
    if (this.discriminator >= VariantTy.ManagedRef) {
      let ptr = <usize>this.value;
      if (ptr) __visit(ptr, cookie);
    }
  }
}
