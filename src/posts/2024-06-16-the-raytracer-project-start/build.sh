#!/bin/bash

set -e

cd "$(dirname "$0")"

mkdir -p static

for i in 0 1 2; do
  sh ../../embed/2024-06-16-the-raytracer-project-start/$i/build.sh
  cp ../../embed/2024-06-16-the-raytracer-project-start/$i/result.bmp static/$i.bmp
done
