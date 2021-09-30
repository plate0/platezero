import { gql } from '@apollo/client'
import { toSlug } from 'common/slug'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getClient } from 'queries'
import { CreateRecipeInput } from 'queries/globalTypes'
import { ImportRecipe, ImportRecipeVariables } from 'queries/ImportRecipe'
import { parse } from 'recipe-parser'

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

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
