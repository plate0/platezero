import { createContext } from 'react'
import { RecipeJSON, RecipeVersionJSON, NoteJSON } from '../models'

interface RecipeContextValue {
  recipe: RecipeJSON
  notes: NoteJSON[]
  masterVersionId: number
  explicitVersionId?: number
  viewingVersion: RecipeVersionJSON
  addNote: (note: NoteJSON) => void
  removeNote: (noteId: number) => void
  editNote: (note: NoteJSON) => void
}

export const RecipeContext = createContext<RecipeContextValue>({
  recipe: undefined,
  notes: [],
  masterVersionId: undefined,
  explicitVersionId: undefined,
  viewingVersion: undefined,
  addNote: (_: NoteJSON) => {},
  removeNote: (_: number) => {},
  editNote: (_: NoteJSON) => {}
})
