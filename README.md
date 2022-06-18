Variant Data Type for AssemblyScript
===

[![Build Status](https://github.com/MaxGraey/as-variant/actions/workflows/test.yml/badge.svg?event=push)](https://github.com/MaxGraey/as-variant/actions/workflows/test.yml?query=branch%3Amain)
[![npm](https://img.shields.io/npm/v/as-variant.svg?color=007acc&logo=npm)](https://www.npmjs.com/package/as-variant)

Supports any builtin types like i32, bool, string and any custom classes (managed and unmanaged).

### Basic Usage

```ts
import { Variant } from 'as-variant/assembly'
// before 0.20.x
// import { Variant } from 'as-variant'

class Foo { }

let vNum = Variant.from(123)      // stored as i32
let vStr = Variant.from('hello')  // stored as string
let vFoo = Variant.from(new Foo)  // stored as Foo reference

vNum.set(2.0)                     // now stored as f64

assert(vNum.is<f64>())            // ok
assert(!vStr.is<f64>())           // ok
assert(vStr.is<string>())         // ok
assert(vFoo.is<Foo>())            // ok

assert(vNum.id != vStr.id)        // compare dynamic IDs.
assert(vFoo.id == Variant.idof<Foo>())

let valF64   = vNum.get<f64>()    // safely extract value
let willFail = vNum.get<string>() // will throw exception!
```

### Unsafe Usage:

```ts
let vNum = Variant.from(123)
// `getUnchecked` skips all checks. It may be danger.
assert(vNum.getUnchecked<i32>() == 123)
```

### Use as value for Any Dynamic Dictionary

```ts
const dict = new Map<string, Variant>()

dict.set('str', Variant.from('hello'))
dict.set('num', Variant.from(124.0))

dict.set('arr', Variant.from([1, 2, 3]))

assert(dict.get('arr').get<i32[]>()[2] == 3)
// or
assert(dict['arr'].get<i32[]>()[2] == 3)
```

which equivalent to JavaScript:

```js
const dict = {
  str: 'hello',
  num: 124.0,
}

dict.arr = [1, 2, 3]

assert(dict.arr[2] == 3)
```
