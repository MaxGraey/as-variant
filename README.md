## Variant Type for AssemblyScript

### Basic Usage

```ts
import { Variant } from 'as-variant'

let vNum = Variant.from(123)      // stored as i32
let vStr = Variant.from('hello')  // stored as string

vNum.set(2.0)                     // now stored as f64

assert(vNum.is<f64>() == true)    // ok
assert(vStr.is<f64>() == false)   // ok
assert(vStr.is<string>() == true) // ok

let valF64 = vNum.get<f64>()      // safely extract value
let tryStr = vNum.get<string>()   // will throw exception!
```

### Use as value for Any Dynamic Dictionary

```ts
const dict = new Map<string, Variant>();

dict.set('str', Variant.from('hello'))
dict.set('num', Variant.from(124.0))

dict.set('arr', Variant.from([1, 2, 3]))

assert(dict.get<i32[]>('arr')[2] == 3);
```

which equivalent to JavaScript:

```js
const dict = {
  str: 'hello',
  num: 124.0
}

dict.arr = [1, 2, 3]

assert(dict.arr[2] == 3);
```
