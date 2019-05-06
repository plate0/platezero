import React, { useState } from 'react'
import { Note } from './Note'
import { NoteJSON, RecipeJSON } from '../models'

export const PinnedNotes = ({
  notes: initialNotes,
  currentVersionId,
  recipe
}: {
  notes: NoteJSON[]
  currentVersionId: number
  recipe: RecipeJSON
}) => {
  const [notes, setNotes] = useState(initialNotes)

  const removeNote = (id: number) => () => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const editNote = (id: number) => (newNote: NoteJSON) => {
    setNotes(notes.map(note => (note.id === id ? newNote : note)))
  }

  const versionLink = (n: NoteJSON) =>
    n.recipe_version_id && n.recipe_version_id !== currentVersionId
      ? `${recipe.html_url}/versions/${n.recipe_version_id}`
      : undefined

  return (
    <div>
      {notes
        .filter(n => n.pinned)
        .map(n => (
          <Note
            key={n.id}
            note={n}
            versionLink={versionLink(n)}
            onDelete={removeNote(n.id)}
            onChange={editNote(n.id)}
          />
        ))}
    </div>
  )
}
