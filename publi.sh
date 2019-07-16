#!/bin/bash
echo "Running Publish..."
rm -rf ./docs/*.*
cp -a ./src/. ./docs/
sed -i "s/%%year%%/$(date '+%Y')/g" ./docs/index.html
echo "Finished!"
