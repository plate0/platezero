import * as _ from 'lodash'
import { normalize } from './model-helpers'

export function changesBetween<
  T extends { id?: number; name?: string; lines: any[] }
>(orig: T[], curr: T[]): T[] {
  const usedSectionIds = {}
  const allLines = _.flatten(_.map(orig, (section) => section.lines))
  const usedLineIds = {}
  return normalize(
    _.map(curr, (currSection) => {
      const lines = _.map(currSection.lines, (currLine) => {
        const origLine = _.find(allLines, (l) => {
          if (_.has(usedLineIds, _.toString(l.id))) {
            return false
          }
          const [a, b] = [l, currLine].map((x) => normalize(_.omit(x, 'id')))
          return _.isEqual(a, b)
        })
        if (origLine) {
          usedLineIds[_.toString(origLine.id)] = true
        }
        return {
          ...currLine,
          id: origLine ? origLine.id : undefined
        }
      })
      const origSection = _.find(
        orig,
        (s) =>
          !_.has(usedSectionIds, _.toString(s.id)) &&
          s.name === currSection.name
      )
      const currentIds = _.keys(_.keyBy(lines, 'id'))
      const origIds = _.keys(_.keyBy(_.get(origSection, 'lines'), 'id'))
      const hasUpdatedLines = !_.isEqual(currentIds, origIds)
      if (origSection && !hasUpdatedLines) {
        usedSectionIds[_.toString(origSection.id)] = true
        return origSection
      }
      return {
        ...currSection,
        lines
      }
    })
  )
}
