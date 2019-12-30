#!/bin/bash
echo 'Running Publish...'
rm -rf ./docs/*.*
cp -a ./src/. ./docs/
echo 'Finished!'
