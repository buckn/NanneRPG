#!/bin/sh

mkdir -p build
npm install
npx tsc --jsx react --noEmit tsx/* && esbuild tsx/* --bundle --outdir=build
npm start 3000