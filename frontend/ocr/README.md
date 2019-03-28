# OCR #
Having this in the same repo really makes life easy for working with our own
code and parsers.

# Helpful Tools #
* s3cmd
* magick
* ghostscript

# Setup
Important!! All of these commands are meant to be run from the `ocr` directory
to not pollute the rest of the file system.

If this is your first time here, run:
```
yarn ocr-compile
```

# Process

1. Checkout what needs to be transcribed.
```
s3cmd ls s3://com-platezero-recipes/USER_ID/
```

2. Download one of the files.
```
s3cmd get 's3://com-platezero-recipes/5/Tortilla Soup.pdf' [local_name.pdf]
```

3. Open the file and take a look. Make sure it's a recipe.
4. Run OCR
```
yarn ocr FILE_NAME.pdf|jpg
```
5. This outputs the text in `recipe.txt`
6. Copy the recipe template and write it up.
```
cp recipe.md.template recipe.md
```
7. Run the parser to get it into the JSON
```
yarn transcribe
```
(Note, defaults to `recipe.md`. Outputs to `recipe.json`)

8. Create the recipe
```
yarn post --id $USER_ID --username $USERNAME [--dev]
```
You can use `--dev` to test on dev first.

9. Delete the file from s3
```
s3cmd rm 's3://com-platezero-recipes/USER_ID/name'
```

10. Cleanup
```
make clean
```

11. Send the user an email
```
Hi ${NAME_OR_USERNAME},

Thanks for using the PlateZero importer! We've finished importing the recipe ${RECIPE_TITLE} for you. You can find it here: ${RECIPE_HTML_URL}

If you have any questions or thoughts, please let us know by replying to this email!

Thank you
```
