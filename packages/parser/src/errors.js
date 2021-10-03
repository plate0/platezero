class RecipeError extends Error {
  constructor(message, recipe) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
    this.recipe = recipe
  }
}

module.exports = {
  RecipeError,
}
