/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.ts,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.ts'
 *     import { myUtil } from '../utils/index.ts'
 *
 *   also incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 *
 */
import { LRUCache } from "lru-cache";

// typescript-memoize is built for TS4 experimental legacy decorators so :shrug: here we go
export function memoize(
  hashFunction = (...args: unknown[]) =>
    args.map((a, i) => `${i}:${a}`).join(";"),
  lruCacheSize?: number,
) {
  return function actualMemoize(
    originalMethod: any,
    // context: ClassMethodDecoratorContext,
  ) {
    let cache = lruCacheSize
      ? new LRUCache({
          max: lruCacheSize,
        })
      : new Map<string, any>();
    return function replacementMethod(this: any, ...args: unknown[]) {
      const hashedArgs = hashFunction(args);
      if (cache.has(hashedArgs)) {
        return cache.get(hashedArgs);
      }
      const result = originalMethod.call(this, ...args);
      cache.set(hashedArgs, result);
      return result;
    };
  };
}
