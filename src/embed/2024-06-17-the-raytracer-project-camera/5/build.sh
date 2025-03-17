#!/bin/bash

set -e

cd "$(dirname "$0")"

sh ../../common/build.sh
diff --strip-trailing-cr -U 3 ../4/main.c main.c | awk '{
  if ($1 == "---" || $1 == "+++") {
    print $1 " " $2
  } else {
    print $0
  }
}' > main.c.diff
