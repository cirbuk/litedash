# litedash

litedash is a light weight version of some most commonly used functions from lodash

## Installation

```Javascript
yarn add litedash
```

## Usage

```Javascript
import {isUndefined, get, mapValues} from "litedash";
```

## Functions

### Type checks

* `isNull(val)`: returns `true` if val is `null`
* `isUndefined(val)`: returns `true` if val is `undefined`
* `isNullOrUndefined(val)`: returns `true` if val is `null` or `undefined`
* `isFunction(val)`: returns `true` if val is a function
* `isString(val)`: returns `true` if val is a string
* `isValidString(val)`: returns `true` if val is a non-empty string
* `isObjectLike(val)`: returns `true` if val is not `null` and is of type `object`
* `isObject(val)`: returns `true` if val is object-like or is a function
* `isPlainObject(val)`: returns `true` if val is an object created by the `Object` constructor or one with a `[[Prototype]]` of `null`.

### JSON

* `get(object, path, defaultValue)`: returns value from `object` at `path`. If the value at `path` is found to be `undefined`, the `defaultValue`(is any) is returned
* `set(object, path, value, options)`: Sets `value` in `object` in the `path` specified. If `options.create` is `true`, all objects along the path will be created

### String

* `capitalize(str)`: Capitalizes `str` i.e. makes the first letter capital
* `getStringHash(str)`: Returns a number hash for `str`
* `getJSONHash(json)`: Returns a number hash for the `json` object

### Object

* `mapValues(object, func)`: Creates an object with the same keys as `object` and values generated by running each of it's properies through `func`. `func` is invoked with 2 arguments `value` and `key`.
* `filterObject(object, func)`: Returns a new object with keys and corresponding values from `object`, for every key/value that returns `true` when `func` is invoked with that value and key as arguments.

### Function

* `debounce(func, wait)`: Creates a debounced function that delays invoking `func` until after `wait` milliseconds have elapsed since the last time the debounced function was invoked.
* `throttle(func, wait, options)`: Creates a throttled function that only invokes `func` at most once per `wait` milliseconds. Provide `options.leading` and `options.trailing` to indicate whether `func` should be invoked on the leading and/or trailing edge of the `wait` timeout. The `func` is invoked with the last arguments provided to the throttled function. Subsequent calls to the throttled function return the result of the last `func` invocation. If `options.leading` and `options.trailing` options are both `true`, `func` is invoked on the trailing edge of the timeout only if the throttled function is invoked more than once during the `wait` timeout. If `wait` is 0 and `options.leading` is `false`, `func` invocation is deferred until to the next tick, similar to setTimeout with a timeout of 0.
* `bindFunctions(funcMap, bindBefore, bindAfter)`: Creates an object with the same keys as `funcMap` whose values are obtained by binding the corresponding functions with values from the arrays `bindBefore` and `bindAfter`. If any of the functions from the resultant map is called with say `arg1` and `arg2`, the function's `arguments` object will be have the value `[...bindBefore, arg1, arg2, ...bindAfter]`
* `pipeline(funcArray, initialState)`: Returns a function that invokes every function in an array of functions starting with the first one, passing results of the previous invocation to the next function in the array.

### Promise

* `resolvePromises(promises)`: If provided with an array of promises, it returns a promise that resolves when all the promises in the array has resolved. The returned promise will resolve with an array of results with the result in index i corresponding to promise i in the input array. If provided with a map of promises, it returns a promise that resolves when all the promises in the object has resolved. The returned promise will resolve with a map of results with the result in key i corresponding to promise at the key i in the input object. If anything else is provided, the input value is returned as such.
