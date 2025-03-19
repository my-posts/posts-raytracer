#!/bin/bash

set -e

cd "$(dirname "$0")"

mkdir -p embed

for i in 0 1 2 3 4 5; do
  sh ../../embed/2024-06-17-the-raytracer-project-camera/$i/build.sh
  cp ../../embed/2024-06-17-the-raytracer-project-camera/$i/result.bmp static/$i.bmp
  cp ../../embed/2024-06-17-the-raytracer-project-camera/$i/main.c.diff embed/$i.diff
done
