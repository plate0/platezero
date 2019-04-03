// same name as recipe prop
export const title = (s: string): string =>
  s
    .trim()
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\s\s+/g, ' ')
    .replace(
      /\w\S*/g,
      txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )

export const subtitle = (s: string): string =>
  s
    .trim()
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\s\s+/g, ' ')

export const description = (s: string): string =>
  s
    .trim()
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\s\s+/g, ' ')

export const ingredients = (s: string): string => s.replace(/^/gm, '* ')
