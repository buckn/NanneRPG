#!/bin/sh

mkdir -p build
touch ~/accounts.json
npm install
npx tsc --jsx react --noEmit tsx/* && esbuild tsx/* --bundle --outdir=build
npm start $1