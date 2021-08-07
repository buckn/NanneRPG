#!/bin/sh

mkdir -p build
npx tsc --jsx react --noEmit tsx/* && esbuild tsx/* --bundle --outdir=build
npm start