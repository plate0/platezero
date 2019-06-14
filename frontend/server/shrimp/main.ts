
async function run() {
    log( 'Process running' )
    let code = await processMessages()
    log( 'Process terminating with code ${code}' )
    process.exitCode = code 
}

async function processMessages(): Promise<number> {
    return new Promise<number>( async ( resolve, reject ) => {
        try {
            log( 'Waiting for messages' )
            let file
            do {
                file = await getMessage()
                if (file) {
                    log( `Received message ${JSON.stringify(file)}` )
                    let text = await loadText(file.url);
                    const recipe = parser.parse(text);
                    postRecipe(recipe)
                }
            } while ( file  )
            resolve( 0 )
        } catch ( err ) {
            console.error( 'Shrimp: ' + err )
            reject( 1 )
        }
    } )
}

function postRecipe(Object o) {}

async function getMessage() {
    return new Promise(( resolve, _reject ) => {
        process.on( 'message', message => {
            resolve( message )
        } )
    } )
}

function log( text ) {
    console.log( `Shrimp: ${text}` )
}

const docx = require("./extractors/docx");
const odt = require("./extractors/odt");
const pdf = require("./extractors/pdf");
const txt = require("./extractors/txt");
const parser = require("./parser");

function loadText(filename) {
  let ext = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase(0);
  switch (ext) {
    case "docx":
      return docx.load(filename);
      break;
    case "odt":
      return odt.load(filename);
      break;
    case "pdf":
      return pdf.load(filename);
      break;
    case "txt":
      return txt.load(filename);
      break;
    default:
      throw `Unsupported file type: ${ext}`;
  }
}


run()
