#!/bin/zsh

git init
git remote add origin $1
git add .
git commit -m "initial commit"
git push -u origin main