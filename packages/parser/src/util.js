const _ = require('lodash')

const text = (sel) => ($) => _.trim($(sel).text())

module.exports = {
  text,
}
