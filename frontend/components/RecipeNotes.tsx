import React, { useState } from 'react'
import { CustomInput, Button } from 'reactstrap'
import { Note } from './Note'
import { Blankslate } from './Blankslate'
import { AddNote } from './AddNote'
import { IfLoggedIn } from './IfLoggedIn'
import { NoteJSON, RecipeJSON } from '../models'

export const RecipeNotes = ({
  notes: initialNotes,
  currentVersionId,
  recipe
}: {
  notes: NoteJSON[]
  currentVersionId: number
  recipe: RecipeJSON
}) => {
  const [notes, setNotes] = useState(initialNotes)
  const [showAll, setShowAll] = useState(false)

  const removeNote = (id: number) => () => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const editNote = (id: number) => (newNote: NoteJSON) => {
    setNotes(notes.map(note => (note.id === id ? newNote : note)))
  }

  const showNote = (note: NoteJSON) =>
    Boolean(showAll || note.recipe_version_id === currentVersionId)

  const hidden = notes.filter(n => !showNote(n))
  const visible = notes.filter(n => showNote(n))

  return (
    <div>
      <IfLoggedIn username={recipe.owner.username}>
        <h5>Add Note</h5>
        <AddNote
          recipeId={recipe.id}
          currentVersionId={currentVersionId}
          onCreate={newNote => setNotes([newNote, ...notes])}
        />
        <hr />
      </IfLoggedIn>
      <div className="text-right mb-3">
        <CustomInput
          type="switch"
          id="showAllSwitch"
          label="Show notes from all versions"
          checked={showAll}
          onChange={() => setShowAll(!showAll)}
        />
      </div>
      {!visible.length && (
        <Blankslate>No notes {showAll || 'on this version'}</Blankslate>
      )}
      {visible.map(n => {
        const versionLink =
          n.recipe_version_id && n.recipe_version_id !== currentVersionId
            ? `${recipe.html_url}/versions/${n.recipe_version_id}`
            : undefined
        return (
          <Note
            key={n.id}
            note={n}
            versionLink={versionLink}
            onDelete={removeNote(n.id)}
            onChange={editNote(n.id)}
          />
        )
      })}
      {!!hidden.length && (
        <div className="text-center mt-3">
          <Button
            color="link"
            size="sm"
            className="text-secondary text-underline"
            onClick={() => setShowAll(true)}
          >
            Show {hidden.length} more
            {hidden.length === 1 ? ' note ' : ' notes '}
            from other versions
          </Button>
        </div>
      )}
    </div>
  )
}
