/**
 * Checks if the passed value is null
 * @param val
 * @returns true if val is null, false otherwise
 */
export const isNull = (val: any) => val === null;

/**
 * Checks if the passed value is undefined
 * @param val
 * @returns true if val is undefined, false otherwise
 */
export const isUndefined = (val: any) => typeof val === "undefined";

/**
 * Checks if the passed value is a function
 * @param val
 * @returns true if val is a function, false otherwise
 */
export const isFunction = (val: any) => typeof val === "function";

/**
 * Checks if the passed value is a string
 * @param val
 * @returns true if val is a string, false otherwise
 */
export const isString = (val: any) => typeof val === "string";

/**
 * Checks if the passed value is a non-empty string(length > 0)
 * @param val
 * @returns true if val is a non-empty string, false otherwise
 */
export const isValidString = (val: any) => isString(val) && val.length > 0;

/**
 * Checks if value is object-like. A value is object-like if it's not null and has a typeof result of "object".
 * @param val
 * @returns true if val is non-null of type object, false otherwise
 */
export const isObjectLike = (val: any) => typeof val === "object" && val !== null;

/**
 * Checks if value is the language type of Object. (e.g. arrays, functions, objects, regexes, new Number(0), and new String(''))
 * @param val
 * @returns true if val is non-null of type object or function, false otherwise
 */
export const isObject = (val: any) => {
  const type = typeof val;
  return val !== null && (type === "object" || isFunction(val));
};

/**
 * Checks if value is a plain object, that is, an object created by the Object constructor or one with a [[Prototype]] of null.
 * @param val
 * @returns true if val is non-null of type object or function, false otherwise
 */
export const isPlainObject = (val: any) => {
  if(!isObjectLike(val) || val.toString() !== "[object Object]") {
    return false;
  }
  if(Object.getPrototypeOf(val) === null) {
    return true;
  }
  let proto = val;
  while(Object.getPrototypeOf(proto) !== null) {
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
export const get = (object: object, path: string | string[] = "", defaultValue?: any) => {
  let result: { [index: string]: any } = object;
  if(path && path.length > 0) {
    if(!Array.isArray(path)) {
      path = path.split(".");
    }
    while(!isUndefined(result) && !isNull(result) && path.length > 0) {
      result = result[path.shift()!];
    }
  }
  return !isUndefined(result) && !isNull(result) ? result : defaultValue;
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
export const set = (object: object, path: string = "", value: any, options: { create?: boolean } = {}) => {
  const { create = false } = options;
  const splits: string[] = path && path.length > 0 ? path.split(".") : [];
  let objectPointer: { [index: string]: any } = object;
  splits.slice(0, splits.length - 1).forEach((spilt, index) => {
    let currentObject = objectPointer[spilt];
    if((isUndefined(currentObject) || isNull(currentObject))) {
      if(!create) {
        throw new Error("Path provided does not exist");
      } else {
        currentObject = {};
      }
    }
    objectPointer[spilt] = currentObject;
    objectPointer = objectPointer[spilt];
  });
  objectPointer[splits.pop()!] = value;
  return object;
};

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed since the last
 * time the debounced function was invoked.
 * @param func
 * @param wait in milliseconds
 * @returns Debounced version of func
 */
export const debounce = (func: Function, wait: number) => {
  let timeout: any;

  return function(this: any, ...args: any[]) {
    let obj = this;
    const delayed = () => {
      func.apply(obj, args);
      timeout = null;
    };

    if(timeout) {
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
export const throttle = (func: Function, wait: number, options: { leading?: boolean, trailing?: boolean } = {}) => {
  let context: any, args: any, result: any;
  let timeout: any = null;
  let previous = 0;
  let later = () => {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if(!timeout) context = args = null;
  };
  return function(this: any, ...values: any[]) {
    let now = Date.now();
    if(!previous && options.leading === false) previous = now;
    let remaining = wait - (now - previous);
    context = this;
    args = [...values];
    if(remaining <= 0 || remaining > wait) {
      if(timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if(!timeout) context = args = null;
    } else if(!timeout && options.trailing !== false) {
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
export const mapValues = (obj: { [index: string]: any }, func: Function) => {
  let keys;
  try {
    keys = Object.keys(obj);
  } catch(ex) {
    throw new Error("Unable to extract keys from provided object");
  }
  return keys.reduce((results: { [index: string]: any }, key) => {
    const value = func(obj[key], key);
    if(!isUndefined(value)) {
      results[key] = value;
    }
    return results;
  }, {});
};

/**
 * Capitalizes the string passed
 * @param str
 * @returns Capitalized string
 */
export const capitalize = (str: string) => (isUndefined(str) || isNull(str)) ? '' : `${(str[0] || "").toUpperCase()}${str.slice(1)}`;

/**
 * Get a number hash of the string passed
 * @param s string value
 * @returns hash value
 */
export const getStringHash = (s: string) =>
  s.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

/**
 * Get a number hash of the json object passed
 * @param json json objectß
 * @returns hash value
 */
export const getJSONHash = (json: any) => getStringHash(JSON.stringify(json));

const getBindings = (bindings: any[] = []) =>
  (Array.isArray(bindings) ? bindings : [bindings])
    .reduce((acc: any[], bindingFn: Function) => {
      let args = isFunction(bindingFn) ? bindingFn() : bindingFn;
      if(!Array.isArray(args)) {
        args = [args];
      }
      return [...acc, ...args];
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
export const bindFunctions = (funcs: { [index: string]: Function }, bindBefore: any[], bindAfter: any[]) => {
  let keys;
  try {
    keys = Object.keys(funcs);
  } catch(ex) {
    throw new Error("Unable to extract keys from provided object");
  }
  return keys.reduce((acc: { [index: string]: any }, key: string) => {
    acc[key] = (...args: any[]) => {
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
export const resolvePromises = (promises: any) => {
  if(Array.isArray(promises)) {
    return Promise.all(promises);
  } else if(isPlainObject(promises)) {
    const keys: string[] = Object.keys(promises);
    const promiseArr: Promise<any>[] = [];
    const keyMap: { [index: number]: string } = keys.reduce((acc: { [index: number]: string }, key: string, index: number) => {
      acc[index] = key;
      promiseArr.push(promises[key]);
      return acc;
    }, {});
    return Promise.all(promiseArr)
      .then(respArr => {
        return respArr.reduce((acc: { [index: string]: any }, resp, index) => {
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
export const pipeline = (functions: Array<Function> = [], initialState?: any): Function => (state: any = initialState): any => functions.reduce((state, fn) => fn(state), state);

/**
 * Value of every key in obj is passed to the function. If the function returns true, the resultant object will have that key
 * and its value, otherwise it is omitted in the returned object
 * @param obj
 * @param func
 */
export const filterObject = (obj: { [index: string]: any }, func: Function) =>
  Object.keys(obj).reduce((results: { [index: string]: any }, key) => {
    const shouldKeep = func(obj[key], key);
    if(shouldKeep === true) {
      results[key] = obj[key];
    }
    return results;
  }, {});
