import { gql } from '@apollo/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getClient } from 'queries'
import { CreateRecipeInput } from 'queries/globalTypes'
import { ImportRecipe, ImportRecipeVariables } from 'queries/ImportRecipe'
import { parse } from 'recipe-parser'
import slugify from 'slugify'

const REPLACEMENT = '-'

const mutation = gql`
  mutation ImportRecipe($input: CreateRecipeInput!) {
    createRecipe(input: $input) {
      recipe {
        slug
        userByUserId {
          username
        }
      }
    }
  }
`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = getClient(req)
  const { url } = req.body
  const input = convert(await parse(url))
  const variables: ImportRecipeVariables = {
    input
  }
  const { data } = await client.mutate<ImportRecipe, ImportRecipeVariables>({
    mutation,
    variables
  })
  res.status(200).json(data.createRecipe.recipe)
}

const convert = ({
  title,
  description,
  image_url: imageUrl,
  preheats,
  ingredient_lists,
  procedure_lists,
  duration,
  ...rest
}: any): CreateRecipeInput => ({
  title,
  slug: toSlug(title),
  description,
  imageUrl,
  duration,
  yield: rest.yield,
  ingredients: (ingredient_lists || [])
    .map(({ lines }) =>
      lines.map(
        (i) =>
          `${i.quantity_numerator}/${i.quantity_denominator} ${i.unit} ${
            i.name
          } ${i.preparation ?? ''} ${i.optional ? '(optional)' : ''}`
      )
    )
    .flat(Infinity)
    .join('\n'),
  procedure: procedure_lists
    .map(({ lines }) => lines.map(({ text }) => text))
    .flat(Infinity)
    .join('\n\n')
})

export const toSlug = (s: string): string =>
  slugify(s, { lower: true, remove: null, replacement: REPLACEMENT })
    .replace(/[^a-z0-9\-]/gi, REPLACEMENT)
    .replace(/\-{2,}/g, REPLACEMENT)
    .replace(/^-|-$/g, '')
    .trim()
