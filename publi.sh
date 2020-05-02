#!/bin/bash

set -e

printf "\033[0;32mPublishing hugo website...\033[0m\n"

# Clean
rm -rf docs

# Build hugo
hugo -t hugo-coder

mv public docs

# Create CNAME
touch docs/CNAME

echo "hunterparks.com" >> docs/CNAME
