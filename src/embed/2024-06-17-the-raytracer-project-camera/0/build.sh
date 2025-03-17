#!/bin/bash

set -e

cd "$(dirname "$0")"

sh ../../common/build.sh
diff --strip-trailing-cr -U 3 ../../2024-06-16-the-raytracer-project-start/2/main.c main.c | awk '{
  if ($1 == "---" || $1 == "+++") {
    print $1 " " $2
  } else {
    print $0
  }
}' > main.c.diff
