#!/bin/bash

echo "Eofol3 Docker test"
echo "[1/3] Cloning Eofol3..."
git clone https://github.com/wurducius/eofol3
cd eofol3
echo "[2/3] Installing Eofol3..."
npm i
echo "[3/3] Running Eofol3..."
npm start
