#!/bin/bash

set -e

cd "$(dirname "$0")"

mkdir -p static

for i in 0 1 2; do
  sh ../../src/embed/2024-06-16-the-raytracer-project-start/$i/build.sh
  cp ../../src/embed/2024-06-16-the-raytracer-project-start/$i/result.bmp static/$i.bmp
  cp ../../src/embed/2024-06-16-the-raytracer-project-start/$i/main.c.diff embed/$i.diff
done
