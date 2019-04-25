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
            Write your steps in the box above, leaving a blank line between each
            one.
          </li>
          <li>
            Separate your steps into sections by beginning a line with a{' '}
            <code>#</code>, such as <code># For the sauce:</code>.
          </li>
          <li>
            You can make text <code>**bold**</code> or <code>_italic_</code>.
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

function parseProcedureLists(text: string): ProcedureListJSON[] {
  const lines = _.split(text, '\n\n')
  return _.reduce(
    lines,
    (acc, line) => {
      if (_.size(acc) === 0) {
        acc.push({ name: undefined, lines: [] })
      }
      const section = _.last(acc)
      if (_.startsWith(line, '# ')) {
        const name = line.substring(2)
        if (section.name) {
          acc.push({ name, lines: [] })
        } else {
          section.name = name
        }
      } else if (_.trim(line) !== '') {
        let lastLine = _.last(section.lines) as ProcedureLineJSON
        if (!lastLine || lastLine.text) {
          lastLine = { image_url: undefined, text: undefined, title: undefined }
          section.lines.push(lastLine)
        }
        if (_.startsWith(line, 'image: ')) {
          lastLine.image_url = line.substring(7)
        } else {
          lastLine.text = _.trim(line)
        }
      }
      return acc
    },
    []
  )
}
