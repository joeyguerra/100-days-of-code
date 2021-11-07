#!/bin/zsh

# example run: ./init.sh git@github.com:joeyguerra/100-days-of-code.git

git init
git remote add origin $1
git add .
git commit -m "initial commit"
git push -u origin main