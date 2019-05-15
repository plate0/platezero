import React, { useState } from 'react'
import { FormGroup, Label, Input, FormText, Button } from 'reactstrap'
import TextareaAutosize from 'react-textarea-autosize'
import { api, getErrorMessages } from '../common/http'
import { AlertErrors } from './AlertErrors'
import { NoteJSON } from '../models'

export const AddNote = ({
  recipeId,
  currentVersionId,
  onCreate
}: {
  recipeId: number
  currentVersionId: number
  onCreate?: (note: NoteJSON) => any
}) => {
  const [isPinned, setPinned] = useState(false)
  const [text, setText] = useState('')
  const [isWorking, setWorking] = useState(false)
  const [errors, setErrors] = useState([])

  const createNote = async e => {
    e.preventDefault()
    setWorking(true)
    setErrors([])
    try {
      const note = await api.createNote({
        pinned: isPinned,
        text,
        recipe_id: recipeId,
        recipe_version_id: currentVersionId
      })
      if (typeof onCreate === 'function') {
        onCreate(note)
      }
      setText('')
      setPinned(false)
    } catch (err) {
      setErrors(getErrorMessages(err))
    }
    setWorking(false)
    return false
  }

  return (
    <form onSubmit={createNote}>
      <FormGroup>
        <TextareaAutosize
          minRows={3}
          className="form-control"
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={isWorking}
        />
      </FormGroup>
      <FormGroup check className="mb-3">
        <Label check>
          <Input
            type="checkbox"
            checked={isPinned}
            onChange={() => setPinned(!isPinned)}
            disabled={isWorking}
          />{' '}
          Pin to top
        </Label>
        <FormText>
          Pin a note so that you'll see it right at the top of your recipe until
          it's dismissed.
        </FormText>
      </FormGroup>
      <AlertErrors errors={errors} />
      <Button type="submit" color="primary" disabled={isWorking}>
        {isWorking ? 'Saving...' : 'Save New Note'}
      </Button>
    </form>
  )
}
