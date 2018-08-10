#!/bin/bash
npm i
node --max-old-space-size=4096 cliTool.js
node cliTool.js getFollowers
