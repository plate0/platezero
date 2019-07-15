# Simple Heuristic Recipe Importer


## Design Notes
1. The `shrimp` component is called from `/recipe/frontend/server/api/importer.ts`, 
in the handler invoked after a file has been uploaded to S3. 
1. `shrimp` downloads the file from S3 and selects a handler based on the file name extension.
If no handler is found, no further processing takes place.
1. The handler reads the file and returns the text.
1. The text is parsed by scanning for keywords and extracting the text between those that are found.
 A `PostRecipe` object is built from the parsed text.
1. The recipe is validated, then uploaded to the database.

## Supported file formats
* `docx` MS Word
* `odt`  Open Office / Libre Office
* `pdf`
* `txt`

New formats can be added by writing a handler and adding it to `loader.ts`
