type AnyFunction = (...args: unknown[]) => unknown;
type AnyObject = { [index: string]: unknown };

/**
 * Checks if the passed value is null
 * @param val
 * @returns true if val is null, false otherwise
 */
export function isNull<T>(val: T | null): val is null {
  return val === null;
}

/**
 * Checks if the passed value is undefined
 * @param val
 * @returns true if val is undefined, false otherwise
 */
export function isUndefined<T>(val: T | undefined): val is undefined {
  return typeof val === "undefined";
}

/**
 * Checks if the passed value is null or undefined
 * @param val
 * @returns true if val is null or undefined, false otherwise
 */
export function isNullOrUndefined<T>(val: T | null | undefined): val is null | undefined {
  return isUndefined(val) || isNull(val);
}

/**
 * Checks if the passed value is a function
 * @param val
 * @returns true if val is a function, false otherwise
 */
export const isFunction = (val: unknown): boolean => typeof val === "function";

/**
 * Checks if the passed value is a string
 * @param val
 * @returns true if val is a string, false otherwise
 */
export function isString<T>(val: T | string): val is string {
  return typeof val === "string";
}

/**
 * Checks if the passed value is a non-empty string(length > 0)
 * @param val
 * @returns true if val is a non-empty string, false otherwise
 */
export const isValidString = (val: unknown): boolean => {
  return isString(val) && val.length > 0;
};

/**
 * Checks if value is object-like. A value is object-like if it's not null and has a typeof result of "object".
 * @param val
 * @returns true if val is non-null of type object, false otherwise
 */
export const isObjectLike = (val: unknown): boolean => typeof val === "object" && !isNull(val);

/**
 * Checks if value is the language type of Object. (e.g. arrays, functions, objects, regexes, new Number(0), and new String(''))
 * @param val
 * @returns true if val is non-null of type object or function, false otherwise
 */
export const isObject = (val: unknown): boolean => {
  return !isNull(val) && (typeof val === "object" || isFunction(val));
};

/**
 * Checks if value is a plain object, that is, an object created by the Object constructor or one with a [[Prototype]] of null.
 * @param val
 * @returns true if val is non-null of type object or function, false otherwise
 */
export const isPlainObject = (val: unknown): boolean => {
  if (!isObjectLike(val) || (val as string).toString() !== "[object Object]") {
    return false;
  }
  if (Object.getPrototypeOf(val) === null) {
    return true;
  }
  let proto = val;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(val) === proto;
};

/**
 * Extract a value from a JSON object
 * @param object
 * @param path
 * @param defaultValue
 * @returns value from the "object" in the "path". If the value there is found to be undefined, the "defaultValue"(is any) is returned
 */
export const get = (object: Record<string, unknown>, path: string | string[] = "", defaultValue?: [unknown]): unknown => {
  let result: Record<string, unknown> = object;
  if (path && path.length > 0) {
    let parsedPath = path;
    if (!Array.isArray(path)) {
      parsedPath = path.split(".");
    }
    while (!isNullOrUndefined(result) && parsedPath.length > 0) {
      // @ts-ignore
      result = result[parsedPath.shift()];
    }
  }
  return !isNullOrUndefined(result) ? result : defaultValue;
};

/**
 * Sets "value" in "object" in the "path" specified. If options.create is true, all objects along the path will be created
 * and the value will be set
 * @param object
 * @param path
 * @param value
 * @param options
 * @throws Error - "Path provided does not exist" if the path does not exist in the object and options.create is false
 * @returns object after setting the value
 */
export const set = (object: Record<string, unknown>, path = "", value: unknown, options: { create?: boolean } = {}): unknown => {
  const { create = false } = options;
  const splits: string[] = path && path.length > 0 ? path.split(".") : [];
  let objectPointer: Record<string, unknown> = object;
  splits.slice(0, splits.length - 1).forEach((spilt) => {
    let currentObject = objectPointer[spilt];
    if (isNullOrUndefined(currentObject)) {
      if (!create) {
        throw new Error("Path provided does not exist");
      } else {
        currentObject = {};
      }
    }
    objectPointer[spilt] = currentObject;
    // @ts-ignore
    objectPointer = objectPointer[spilt];
  });
  // @ts-ignore
  objectPointer[splits.pop()] = value;
  return object;
};

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed since the last
 * time the debounced function was invoked.
 * @param func
 * @param wait in milliseconds
 * @returns Debounced version of func
 */
export const debounce = (func: (...args: unknown[]) => unknown, wait: number): AnyFunction => {
  let timeout: NodeJS.Timeout | null;

  return function debouncedFunction(this: unknown, ...args: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let obj: unknown = this;
    const delayed = () => {
      func.apply(obj, args);
      timeout = null;
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(delayed, wait || 100);
  };
};

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * Provide options to indicate whether func should be invoked on the leading and/or trailing edge of the wait timeout.
 * The func is invoked with the last arguments provided to the throttled function.
 * Subsequent calls to the throttled function return the result of the last func invocation.
 * If leading and trailing options are true, func is invoked on the trailing edge of the timeout only if the throttled
 * function is invoked more than once during the wait timeout.
 * If wait is 0 and leading is false, func invocation is deferred until to the next tick, similar to setTimeout with
 * a timeout of 0.
 * @param func
 * @param wait in milliseconds
 * @param options
 *  - options.leading: if true will invoke the function at the leading edge of the wait timeout
 *  - options.trailing: if true will invoke the function at the trailing edge of the wait timeout
 * @returns Throttled version of func
 */
export const throttle = (func: AnyFunction, wait: number, options: { leading?: boolean; trailing?: boolean } = {}): AnyFunction => {
  let context: unknown;
  let args: unknown[] | null;
  let result: unknown;
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;
  let later = () => {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args as unknown[]);
    if (!timeout) {
      context = null;
      args = null;
    }
  };
  return function throttledFunction(this: unknown, ...values: unknown[]) {
    let now = Date.now();
    if (!previous && options.leading === false) previous = now;
    let remaining = wait - (now - previous);
    context = this;
    args = [...values];
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) {
        context = null;
        args = null;
      }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

/**
 * Creates an object with the same keys as object and values generated by running each
 * property of object through func. The func is invoked with 2 arguments: (value, key).
 * @param obj
 * @param func
 * @returns object
 */
export const mapValues = (obj: AnyObject, func: (value: unknown, key: string) => unknown): AnyObject => {
  let keys;
  try {
    keys = Object.keys(obj);
  } catch (ex) {
    throw new Error("Unable to extract keys from provided object");
  }
  return keys.reduce((results: AnyObject, key) => {
    const value = func(obj[key], key);
    const modified = {
      ...results,
    };
    if (!isUndefined(value)) {
      modified[key] = value;
    }
    return modified;
  }, {});
};

/**
 * Capitalizes the string passed
 * @param str
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => (isNullOrUndefined(str) ? "" : `${(str[0] || "").toUpperCase()}${str.slice(1)}`);

/**
 * Get a number hash of the string passed
 * @param s string value
 * @returns hash value
 */
export const getStringHash = (s: string): number =>
  s.split("").reduce((a, b) => {
    let modA = (a << 5) - a + b.charCodeAt(0);
    return modA & modA;
  }, 0);

/**
 * Get a number hash of the json object passed
 * @param json json object
 * @returns hash value
 */
export const getJSONHash = (json: unknown): number => getStringHash(JSON.stringify(json));

const getBindings = (bindings: unknown[] = []) =>
  (Array.isArray(bindings) ? bindings : [bindings]).reduce((acc: unknown[], bindingFn: AnyFunction) => {
    let args: unknown[] | unknown = isFunction(bindingFn) ? bindingFn() : bindingFn;
    if (!Array.isArray(args)) {
      args = [args];
    }
    return [...acc, ...(args as unknown[])];
  }, []);

/**
 * Takes in a map of functions and an array of objects/functions to be bound as
 * arguments to each functions in the map and returns the function map that is bound
 * to those arguments
 * @param funcs
 * @param bindBefore
 * @param bindAfter
 * @returns object with bound functions
 */
export const bindFunctions = (funcs: { [index: string]: AnyFunction }, bindBefore: unknown[], bindAfter: unknown[]): { [index: string]: AnyFunction } => {
  let keys: string[];
  try {
    keys = Object.keys(funcs);
  } catch (ex) {
    throw new Error("Unable to extract keys from provided object");
  }

  return keys.reduce<{ [index: string]: AnyFunction }>((acc, key) => {
    acc[key] = (...args: unknown[]) => {
      const beforeArgs = getBindings(bindBefore);
      const afterArgs = getBindings(bindAfter);
      return funcs[key](...beforeArgs, ...args, ...afterArgs);
    };
    return acc;
  }, {});
};

/**
 *  - If provided an array of promises, returns a promise that resolves when all the promises in the array has resolved.
 *  The returned promise will resolve with an array of results with the result in index i corresponding to promise i in
 *  the input array
 *  - If provided a map of promises, returns a promise that resolves when all the promises in the object has resolved.
 *  The returned promise will resolve with a map of results with the result in key i corresponding to promise at the key
 *  i in the input object
 *  - If anything else is provided, the input value is returned as such
 * @param promises: array or promises or map of promises or a single promise
 */
export const resolvePromises = (promises: Promise<unknown>[]): Promise<unknown> => {
  if (Array.isArray(promises)) {
    return Promise.all(promises);
  }
  if (isPlainObject(promises)) {
    const keys: string[] = Object.keys(promises);
    const promiseArr: Promise<unknown>[] = [];
    const keyMap: { [index: number]: string } = keys.reduce((acc: { [index: number]: string }, key: string, index: number) => {
      acc[index] = key;
      promiseArr.push(promises[key]);
      return acc;
    }, {});
    return Promise.all(promiseArr).then((respArr) => {
      return respArr.reduce((acc: AnyObject, resp, index) => {
        acc[keyMap[index]] = resp;
        return acc;
      }, {});
    });
  }
  return promises;
};

/**
 * Returns a function that invokes the given series of functions whose output is subsequently passed to the next
 * function in the series.
 * @param functions: Array of functions that constitute the pipeline
 * @param initialState: If the pipeline is called with no parameters, this value will be taken as the starting value
 * for the first function in the pipeline
 */
export const pipeline = (functions: Array<AnyFunction> = [], initialState?: unknown): AnyFunction => (state: unknown = initialState): unknown =>
  functions.reduce((state, fn) => fn(state), state);

/**
 * Value of every key in obj is passed to the function. If the function returns true, the resultant object will have that key
 * and its value, otherwise it is omitted in the returned object
 * @param obj
 * @param func
 */
export const filterObject = (obj: AnyObject, func: AnyFunction): AnyObject =>
  Object.keys(obj).reduce((results: AnyObject, key) => {
    const shouldKeep = func(obj[key], key);
    const modResults = { ...results };
    if (shouldKeep === true) {
      modResults[key] = obj[key];
    }
    return modResults;
  }, {});

// @ts-ignore
export const isNumber = (n: unknown): boolean => (typeof n === "number" || isValidString(n)) && Number.isFinite(+n);

export const getAsNumbers = (object: AnyObject, paths: string | string[] = [], defaults = []): unknown | number | unknown[] => {
  const parsedDefaults = !isUndefined(defaults) ? defaults : Array.isArray(paths) ? [] : undefined;
  const getValue = (path: string, index = 0) => {
    const value = get(object, path);
    if (isUndefined(value)) {
      return !Array.isArray(parsedDefaults) ? parsedDefaults : parsedDefaults[index];
    }
    if (!isNumber(value)) {
      return value;
    }
    return +(value as number);
  };
  if (isString(paths)) {
    return getValue(paths);
  }
  if (Array.isArray(paths)) {
    return paths.map(getValue);
  }
  return undefined;
};
