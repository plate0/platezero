/**
 * Jest matcher for checking that a JSON patch is correct, useful for testing
 * diffing algorithms.
 *
 * Example:
 *
 *    import '../test/matchers'
 *
 *    test('patch is correct', () => {
 *      expect(makePatch(a, b)).toBePatchFor(a, b)
 *    })
 *
 * This requires a little Typescript magic, see
 * https://stackoverflow.com/questions/43667085/extending-third-party-module-that-is-globally-exposed
 * for details.
 */
import prettyFormat from 'pretty-format'
import diff from 'jest-diff'
import * as rfc6902 from 'rfc6902'
import * as _ from 'lodash'

// ensure this file is treated as a module
export {}

// add the toBePatchFor matcher to the jest namespace
declare global {
  namespace jest {
    interface Matchers<R> {
      toBePatchFor: (a: object, b: object) => any
    }
  }
}

// mutate the global expect instance
expect.extend({
  toBePatchFor(patch, orig, curr) {
    const result = Object.assign({}, orig)
    rfc6902.applyPatch(result, patch)
    const pass = this.equals(curr, result)
    const message = pass
      ? () =>
          this.utils.matcherHint('toBePatchFor') +
          '\n\n' +
          `Patch: ${prettyFormat(patch)}\n` +
          `Expected: ${this.utils.printExpected(curr)}\n` +
          `Received: ${this.utils.printReceived(result)}`
      : () => {
          const difference = diff(curr, result, { expand: this.expand })
          return (
            this.utils.matcherHint('toBePatchFor') +
            '\n\n' +
            (difference && difference.includes('- Expect')
              ? `Patch:\n${prettyFormat(patch)}\n` +
                `Difference:\n\n${difference}`
              : `Patch: ${prettyFormat(patch)}\n` +
                `Expected: ${this.utils.printExpected(curr)}\n` +
                `Received: ${this.utils.printReceived(result)}`)
          )
        }
    return { actual: result, message, pass }
  }
})
