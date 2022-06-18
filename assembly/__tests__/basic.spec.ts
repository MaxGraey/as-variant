import { Variant } from "../index";

class Foo {}

describe("Variant/from, Variant/is, Variant/get", () => {
  it("should init as i32 type", () => {
    let val = Variant.from(123);
    expect(val.is<i32>()).toBe(true);
    expect(val.get<i32>()).toBe(123);
  });

  it("should init as f32 type", () => {
    let val = Variant.from<f32>(123.0);
    expect(val.is<f32>()).toBe(true);
    expect(val.is<f64>()).toBe(false);
    expect(val.get<f32>()).toBe(<f32>123.0);
  });

  it("should init as f64 type", () => {
    let val = Variant.from(-123.0);
    expect(val.is<f64>()).toBe(true);
    expect(val.get<f64>()).toBe(-123.0);
  });

  it("should init as NaN value", () => {
    let val = Variant.from(NaN);
    expect(val.get<f64>()).toBeNaN();
  });

  it("should init as bool type", () => {
    let val = Variant.from(true);
    expect(val.is<bool>()).toBe(true);
    expect(val.is<u8>()).toBe(false);
    expect(val.get<bool>()).toBe(true);
  });

  it("should init as u8 type", () => {
    let val = Variant.from<u8>(0xFF);
    expect(val.is<u8>()).toBe(true);
    expect(val.get<u8>()).toBe(0xFF);
  });

  it("should init as string type", () => {
    let val = Variant.from("foobaz");
    expect(val.is<string>()).toBe(true);
    expect(val.get<string>()).toBe("foobaz");
  });

  it("should init as array type", () => {
    let val = Variant.from([1, 2, 3]);
    expect(val.is<i32[]>()).toBe(true);
    expect(val.is<Int32Array>()).toBe(false);
    expect(val.get<i32[]>()[0]).toBe(1);
    expect(val.get<i32[]>()[1]).toBe(2);
    expect(val.get<i32[]>()[2]).toBe(3);
  });

  it("should init as variant type", () => {
    let val = Variant.from(Variant.from(123));
    expect(val.is<Variant>()).toBe(true);
    expect(val.get<Variant>().get<i32>()).toBe(123);
  });
});

describe("Variant/id", () => {
  it("should get ids", () => {
    let _bool = Variant.from(true);
    let _u8  = Variant.from<u8>(3);
    let _i32  = Variant.from(123);
    let _foo  = Variant.from(new Foo);
    expect(_bool.id).toBe(Variant.idof<bool>());
    expect(_i32.id).toBe(Variant.idof<i32>());
    expect(_u8.id).toBe(Variant.idof<u8>());
    expect(_foo.id).toBe(Variant.idof<Foo>());
  });
});

describe("Variant/set", () => {
  it("should set variant(i32) as variant(string)", () => {
    let val = Variant.from(123);
    val.set('foobaz');
    expect(val.is<string>()).toBe(true);
    expect(val.get<string>()).toBe('foobaz');
  });
});

describe("Variant/get exceptions", () => {
  it("should throw exceptions", () => {
    throws("should throw for get<string>()", () => {
      let _ = Variant.from(123).get<string>();
    });

    throws("should throw for get<f32>()", () => {
      let _ = Variant.from(123).get<f32>();
    });
  });
});
