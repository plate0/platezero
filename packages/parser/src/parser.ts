// const cheerio = require('cheerio')

export interface Parser {
  title: ($: cheerio.Root) => string
}

export const

// /*
//  *
//  */
// const dom = (func) => (html, ...rest) => func(cheerio.load(html), ...rest)

// /**
//  * Transform the given value and key into a function
//  * @param val the value of the property specified by 'key';
//  *            may be a string or a function
//  * @param key the key to 'value' in the object being traversed;
//  *            should be one of the exports from html.js
//  * @return a function to retrieve the recipe component indicated by 'key'
//  */
// const handler = (val, key) => {
//   return typeof val === 'function' ? val : (html[key] || html.text)(val)
// }
// /**
//  * Transform each value in 'object' to the result of calling it as a function
//  * @param object the object
//  * @return the transformed object
//  */
// const mapValues = (object) => (...args) =>
//   _.mapValues(object, (v) => (v ? v(...args) : undefined))

// /**
//  * Returns a parser based on the given 'partial' parser.
//  *
//  * @param partial Either a function to parse html to a recipe
//  *                or     a map of recipe component names to functions or selectors
//  *
//  * If 'partial' is a function, it needs to
//  *    1. take arguments (html, {options})
//  *    2. construct and return a PostRecipe
//  *
//  * Otherwise, 'partial' should be as described in README.md
//  *
//  * @return a function to parse html to a recipe
//  */
// const parser = (partial) =>
//   typeof partial === 'function'
//     ? partial
//     : dom(mapValues(_.mapValues({ ...html.defaults, ...partial }, handler)))

// module.exports = {
//   dom,
//   mapValues,
//   parser,
//   handler,
// }
