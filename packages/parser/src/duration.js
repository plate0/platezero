const moment = require('moment')
const { fromPairs } = require('lodash')
const { text } = require('./util')

const DurationUnits = {
  y: 'years',
  M: 'months',
  w: 'weeks',
  d: 'days',
  m: 'minutes',
  s: 'seconds',
}

const valid = (d) => d.asSeconds() > 0

const mapRegex = (str, regex, func) => {
  const output = []
  let i = 0
  while ((m = regex.exec(str)) !== null) {
    output.push(func(m, i))
    i++
  }
  return output
}

const parse = (s) => {
  let d = moment.duration(s)
  if (valid(d)) {
    return d.asSeconds()
  }

  // Handles '1 h 20 m'
  const timeAndUnitPairs = mapRegex(
    s,
    /(\d+)\s?([yMwdhms])/gm,
    ([, time, unit]) => [unit, time]
  )
  if (timeAndUnitPairs.length > 0) {
    d = moment.duration(fromPairs(timeAndUnitPairs))
    if (valid(d)) {
      return d.asSeconds()
    }
  }
  return undefined
}

const duration = (sel) => ($) => {
  return parse(text(sel)($))
}

module.exports = {
  duration,
  _parseDuration: parse,
}
