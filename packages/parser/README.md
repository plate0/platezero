# Recipe Parser

The best way to parse a recipe.

## Install

This module is currently not published to npm, so to add it to your
dependencies, use something like this in your `package.json` (replacing
`v1.0.0` with the git tag of the release you'd like to use):

```json
"dependencies": {
  "recipe-parser": "https://github.com/plate0/recipe-parser#v1.0.0"
}
```

## Usage

The recipe parser exports a single top-level function, `parse`, which takes a
URL as an arguement and returns a `Promise<Recipe>` formatted in the PlateZero
format.

```javascript
const { parse } = require('recipe-parser')

const main = async () => {
  const recipe = await parse('https://www.example.com/recipe')
  console.log(recipe)
}
```

## Parsing

This library contains a default parser that is used unless a more site specific
parser is available. While we aim for the default parser to be as good as
possible, sometimes sites are formatted too poorly to use it, or we want to
have even better support for very popular sites. In both cases, site specific
parsers are choosen based off of the hostname in the URL.

### Writing a Parser

If you want to add a parser, this library has three different methods depending
on the power you need.

#### Easiest, Most Basic, JSON Parser

If the website _mostly_ works, but is only missing a section or two that is
easily accessible in the DOM, a JSON file can be the entire importer. The JSON
file contains an object of which the keys are the keys in the recipe and the
values are CSS selectors to find the correct elements in the DOM. Certain keys
are automatically passed to functions to do additional parsing
(`ingredient_lists` and `procedure_lists`)

```
www.myrecipesite.com.json
---

{
  "description": "p.description",
  "ingredient_lists": "div > div > div .ingredients ul li"
}
```

In this example, the `description` will get the text value at that selector,
and the `ingredient_lists` will take all the list elements in that selector and
parse them each as an ingredient line.

#### Partial JavaScript Parser

The most common parser in the library is a JavaScript parser that only
overrides the defaults where it needs to. In this case each key added to the
`exports` overrides the default for that key, with the value. If the value is
only a string, it's treated as a CSS selector and passed to the appropriate
function.

Each function takes the Cheerio DOM element as a arguement and should return
what the recipe object expects for that key.

```javascript
const moment = require('moment')

exports.duration = ($) => {
  return moment.duration($('#cooking-time').text()).asSeconds()
}

exports.image_url = '#main img'
```

By using JavaScript, we can take advantage of any custom parsing that needs to
happen, but don't need to define the entire recipe, only those sections that
need additional help.

#### Full Parser

Lastly, for sites that need a lot of custom work and no defaults are suitable,
a totally custom parser can be written. These parsers export a function as
their only default export, and the parser utilities pass it through to the end
user. It is up to the author to ensure it works correctly and returns a valid
recipe. For an example, look at the Reddit parser, which takes all Reddit
domains and looks up sub-parsers based off of the subreddit to use.

```javascript
module.exports = dom(($, ...rest) => {
  // Custom Parser
})
```
