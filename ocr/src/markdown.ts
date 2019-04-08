import { MarkdownRecipe } from './models'

export const toMarkdown = (recipe: MarkdownRecipe): string => {
  let md = ``
  if (recipe.duration) {
    md += `
<meta itemprop="cookTime" content="${recipe.duration}"></meta>
`
  }
  if (recipe.yld) {
    md += `
<meta itemprop="recipeYield" content="${recipe.yld}"></meta>
`
  }
  md += `
# ${recipe.title}
`

  if (recipe.subtitle) {
    md += `
## ${recipe.subtitle}
`
  }

  if (recipe.description) {
    md += `
${recipe.description}
`
  }

  md += `
${recipe.ingredients}
    `

  md += `

${recipe.procedures}
    `
  return md
}
