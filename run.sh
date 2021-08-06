#!/bin/sh

mkdir -p build
npx tsc --noEmit ts/* && esbuild ts/* --bundle --outdir=build
npm start