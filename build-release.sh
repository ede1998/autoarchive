#!/bin/sh

version=`jq -r ".version" manifest.json`
 
zip -r "auto-archive-$version.xpi" *.js *.html *.css images/ scripts/ manifest.json
