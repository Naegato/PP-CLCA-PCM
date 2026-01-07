#!/bin/bash

# Script to fix ES module imports in Prisma generated files
# This script adds .js extensions to relative imports

cd "$(dirname "$0")/../repositories/prisma/generated" || exit 1

echo "Fixing Prisma generated imports..."

# Fix single-quoted imports: from './xxx'
find . -name "*.ts" -type f -exec sed -i "s|from '\./\([^']*\)'|from './\1.js'|g" {} \;

# Fix double-quoted imports: from "./xxx"
find . -name "*.ts" -type f -exec sed -i 's|from "\./\([^"]*\)"|from "./\1.js"|g' {} \;

# Remove double .js.js if any
find . -name "*.ts" -type f -exec sed -i "s|\.js\.js|.js|g" {} \;

echo "Prisma imports fixed!"
