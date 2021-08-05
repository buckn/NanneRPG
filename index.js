/* imports */

var fs = require('fs');
const express = require('express')

/* ts build process */

//make build directory if needed
if (!fs.existsSync('./build')){
    fs.mkdirSync('./build');
}

//esbuild ts files to a single js file
require('esbuild').buildSync({
  entryPoints: ['./ts/main.ts'],
  outfile: './build/out.js',
})

/* ts build process */

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})