#!/bin/bash

set -e

cd "$(dirname "$0")"

cmake -DCMAKE_BUILD_TYPE=Release -B builddir
cmake --build builddir --config Release
builddir/main ./result.bmp
