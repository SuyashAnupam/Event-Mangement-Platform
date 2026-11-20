#!/bin/sh
# Compile all Java files into ./out and start the website on http://localhost:8080
cd "$(dirname "$0")"
javac -d out *.java && java -cp out WebServer "$@"
