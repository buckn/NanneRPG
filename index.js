var fs = require('fs');

if (!fs.existsSync('./build')){
    fs.mkdirSync('./build');
}

require('esbuild').buildSync({
  entryPoints: ['./ts/main.ts'],
  outfile: './build/out.js',
})