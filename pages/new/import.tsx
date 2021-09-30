import { Header, Input } from 'components'
import { useRouter } from 'next/router'
import { ImportRecipe_createRecipe_recipe } from 'queries/ImportRecipe'
import { useState } from 'react'

export default function ImportPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')

  // This is not a mutation since we need to do some custom fetching of
  // the recipe before we can create the mutation.
  // TODO: Wrap this in a `useAPI` hook that functions like useMutation
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/recipe/import', {
        method: 'POST',
        body: JSON.stringify({ url }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const json: ImportRecipe_createRecipe_recipe = await res.json()
      router.push(`/${json.userByUserId.username}/${json.slug}`)
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <>
      <Header />
      <form onSubmit={onSubmit}>
        <Input
          placeholder="url to import"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button>Import</button>
      </form>
    </>
  )
}
