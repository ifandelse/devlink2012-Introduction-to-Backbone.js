#!/bin/sh
rm -rf dist
r.js -o "src/app.build.js"
rm -rf dist/views
rm -rf dist/app.build.js