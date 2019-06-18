# Embryonic file parser
The parser is forked as a separate `node` app by `/recipe/frontend/server/api/importer.ts` and listens on an IPC socket.
When a file is imported into PZ, the importer passes the S3 file info and the user id to the IPC.


## Design Notes
1. The app downloads the file from S3 and selects a handler based on the file name extension.
1. The handler reads the file and returns the text.
1. The text is parsed by scanning for keywords and extracting the text between those that are found,
and a `PostRecipe` is built.
1. The recipe is validated, then uploaded to the database.

## Supported file formats
* `docx` MS Word
* `odt`  Open Office / Libre Office
* `pdf`
* `txt`

New formats can be added by writing a handler and adding it to `loader.ts`
