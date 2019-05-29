import React from 'react'
import * as _ from 'lodash'

import { ProcedureListJSON, ProcedureLineJSON } from '../models'
import { ProcedureLists } from './ProcedureLists'
import { Blankslate } from './Blankslate'
import { changesBetween } from '../common/changes'
import { LivePreviewEditor } from './LivePreviewEditor'

interface Props {
  lists: ProcedureListJSON[]
  onChange?: (lists: ProcedureListJSON[]) => any
}

export function ProcedureListsEditor(props: Props) {
  return (
    <LivePreviewEditor
      initialData={props.lists}
      dataToText={procedureListsToText}
      textToData={parseProcedureLists}
      preview={lists => <ProcedureLists lists={lists} />}
      placeholder={`# For the sauce\n\nSweat the aromatics.\n\nAdd remaining ingredients.`}
      onChange={props.onChange}
      differ={changesBetween}
      minHeight="9rem"
      blankslate={
        <Blankslate className="h-100 w-100">
          <p>
            <strong>Instructions Preview</strong>
          </p>
          <div className="small">
            As you type the instructions, a preview will appear here.
          </div>
        </Blankslate>
      }
      hasPreview={lists =>
        Boolean(lists && lists.length && lists[0].lines.length)
      }
      formattingTips={
        <ul className="small">
          <li>
            Separate your steps into sections by beginning a line with a{' '}
            <strong>#</strong>, such as <strong># For the sauce</strong>.
          </li>
          <li>
            You can make text <strong>**bold**</strong> or <em>_italic_</em>.
          </li>
        </ul>
      }
    />
  )
}

function procedureListsToText(lists: ProcedureListJSON[]): string {
  return _.join(_.map(lists, procedureListToText), '\n\n')
}

function procedureListToText(list: ProcedureListJSON): string {
  let text = ''
  if (list.name) {
    text += `# ${list.name}\n\n`
  }
  text += _.join(_.map(list.lines, procedureLineToText), '\n\n')
  return text
}

function procedureLineToText(line: ProcedureLineJSON): string {
  let text = ''
  if (line.image_url) {
    text += `image: ${line.image_url}\n\n`
  }
  if (line.title) {
    text += `**${line.title}** `
  }
  text += line.text
  return text
}

export function parseProcedureLists(text: string): ProcedureListJSON[] {
  const IMG_PREFIX = 'image:'
  const HEADER_PREFIX = '#'
  const lines = _.split(text, '\n')
  return _.reduce(
    lines,
    (acc, line) => {
      // skip blank lines
      if (_.trim(line) === '') {
        return acc
      }

      // add a new section if it's a header
      if (_.startsWith(line, HEADER_PREFIX)) {
        const name = getSuffix(HEADER_PREFIX, line)
        acc.push({ name, lines: [] })
        return acc
      }

      // images are the start of a new line
      if (_.startsWith(line, IMG_PREFIX)) {
        const section = getOrCreateSection(acc)
        const image_url = getSuffix(IMG_PREFIX, line)
        section.lines.push({ image_url, text: undefined, title: undefined })
        return acc
      }

      // figure the previous line, if any
      const lastLine = getLastLine(acc)

      // if there's a previous line with only an image, then this line is the
      // text for it
      if (lastLine && !lastLine.text) {
        lastLine.text = line
        return acc
      }

      // special case: should we join this text with the previous line?
      if (shouldJoin(lastLine, line)) {
        lastLine.text += '\n' + line
        return acc
      }

      // add a new line
      // if we don't already have a section, create one for the new line
      const section = getOrCreateSection(acc)
      section.lines.push({
        text: line,
        title: undefined,
        image_url: undefined
      })

      return acc
    },
    []
  )
}

// given a possibly-empty list of possibly-empty sections, return the last line
// of the last section, or undefined if it does not exist
function getLastLine(
  sections: ProcedureListJSON[]
): ProcedureLineJSON | undefined {
  const section = _.last(sections)
  if (!section) {
    return undefined
  }
  return _.last(section.lines)
}

// given a possibly-empty list of sections, return the last section or a newly
// created one
function getOrCreateSection(sections: ProcedureListJSON[]) {
  const existingSection = _.last(sections)
  if (existingSection) {
    return existingSection
  }
  const section = { name: undefined, lines: [] }
  sections.push(section)
  return section
}

// check whether we are in the middle of a table (previous line ends with | and
// current line starts with |)
function isInTable(lastLine: ProcedureLineJSON | undefined, currLine: string) {
  return Boolean(
    lastLine && _.endsWith(lastLine.text, '|') && _.startsWith(currLine, '|')
  )
}

// check whether a line ends in a line break (two spaces)
function hasLineBreak(line: ProcedureLineJSON | undefined) {
  return Boolean(line && _.endsWith(line.text, '  '))
}

// check whether the current line text should be joined into the previous line,
// such as is the case when the previous line ends with a break
function shouldJoin(lastLine: ProcedureLineJSON | undefined, currLine: string) {
  return isInTable(lastLine, currLine) || hasLineBreak(lastLine)
}

// given a prefix and a line, get the rest of the line
function getSuffix(prefix: string, line: string) {
  return _.trim(line.substring(prefix.length))
}
