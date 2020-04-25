import React, { useContext } from 'react'
import { Note } from './Note'
import { NoteJSON } from '../models'
import { RecipeContext } from '../context/RecipeContext'

export const PinnedNotes = () => {
  const { recipe, viewingVersion, notes, editNote, removeNote } = useContext(
    RecipeContext
  )

  const versionLink = (n: NoteJSON) =>
    n.recipe_version_id && n.recipe_version_id !== viewingVersion.id
      ? `${recipe.html_url}/versions/${n.recipe_version_id}`
      : undefined

  return (
    <div>
      {notes
        .filter((n) => n.pinned)
        .map((n) => (
          <Note
            key={n.id}
            note={n}
            versionLink={versionLink(n)}
            onDelete={() => removeNote(n.id)}
            onChange={editNote}
          />
        ))}
    </div>
  )
}
